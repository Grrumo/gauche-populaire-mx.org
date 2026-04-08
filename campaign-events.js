(function () {
  const lang = (document.documentElement.lang || "fr").toLowerCase().startsWith("es") ? "es" : "fr";
  const config = (window.GP_EVENTS_CONFIG && window.GP_EVENTS_CONFIG[lang]) || {};

  const statusNode = document.querySelector(".js-events-status");
  const bodyNode = document.querySelector(".js-events-body");
  const editLink = document.querySelector(".js-events-edit-link");
  const heroTitle = document.querySelector(".events-hero h1");

  if (!bodyNode) {
    return;
  }

  const labels = {
    fr: {
      loading: "Chargement...",
      loaded: "À jour",
      empty: "Aucun événement programmé pour le moment.",
      loadError: "Réessayez plus tard."
    },
    es: {
      loading: "Cargando...",
      loaded: "Actualizado",
      empty: "No hay eventos programados por el momento.",
      loadError: "Reintenta más tarde."
    }
  }[lang];

  function isConfigured(url) {
    return typeof url === "string" && url.length > 0 && !url.includes("SHEET_ID");
  }

  function parseCsv(text) {
    const rows = [];
    let row = [];
    let value = "";
    let inQuotes = false;

    for (let i = 0; i < text.length; i += 1) {
      const char = text[i];
      const next = text[i + 1];

      if (char === '"') {
        if (inQuotes && next === '"') {
          value += '"';
          i += 1;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        row.push(value.trim());
        value = "";
      } else if ((char === "\n" || char === "\r") && !inQuotes) {
        if (char === "\r" && next === "\n") {
          i += 1;
        }
        if (value.length > 0 || row.length > 0) {
          row.push(value.trim());
          rows.push(row);
          row = [];
          value = "";
        }
      } else {
        value += char;
      }
    }

    if (value.length > 0 || row.length > 0) {
      row.push(value.trim());
      rows.push(row);
    }

    return rows;
  }

  function mapRows(rows) {
    if (!rows.length) {
      return [];
    }

    const normalizeHeader = (value) =>
      String(value || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, " ")
        .trim();

    const headers = rows[0].map(normalizeHeader);
    const findHeader = (aliases) => headers.findIndex((h) => aliases.some((alias) => h === alias || h.includes(alias)));

    const idx = {
      date: findHeader(["date", "fecha"]),
      time: findHeader(["time", "heure", "hora"]),
      city: findHeader(["city", "ville", "ciudad", "region ville", "region ciudad"]),
      place: findHeader(["place", "lieu", "lugar"]),
      title: findHeader(["title", "titre", "evenement", "evento", "event"]),
      details: findHeader(["details", "description", "detalles"])
    };

    return rows
      .slice(1)
      .filter((r) => r.some((c) => c && c.trim().length > 0))
      .map((r) => ({
        date: idx.date >= 0 ? r[idx.date] || "" : "",
        time: idx.time >= 0 ? r[idx.time] || "" : "",
        city: idx.city >= 0 ? r[idx.city] || "" : "",
        place: idx.place >= 0 ? r[idx.place] || "" : "",
        title: idx.title >= 0 ? r[idx.title] || "" : "",
        details: idx.details >= 0 ? r[idx.details] || "" : ""
      }));
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function render(rows) {
    if (!rows.length) {
      bodyNode.innerHTML = '<tr><td colspan="6" class="events-empty">' + labels.empty + "</td></tr>";
      return;
    }

    bodyNode.innerHTML = rows
      .map(
        (item) =>
          "<tr>" +
          "<td>" + escapeHtml(item.date) + "</td>" +
          "<td>" + escapeHtml(item.time) + "</td>" +
          "<td>" + escapeHtml(item.city) + "</td>" +
          "<td>" + escapeHtml(item.place) + "</td>" +
          "<td>" + escapeHtml(item.title) + "</td>" +
          "<td>" + escapeHtml(item.details) + "</td>" +
          "</tr>"
      )
      .join("");
  }

  if (editLink && typeof config.editUrl === "string" && !config.editUrl.includes("SHEET_ID")) {
    editLink.href = config.editUrl;
    editLink.hidden = false;
  }

  function fitHeroTitle() {
    if (!heroTitle) {
      return;
    }

    const maxPx = 86;
    const minPx = 26;
    let size = maxPx;
    heroTitle.style.fontSize = size + "px";

    while (heroTitle.scrollWidth > heroTitle.clientWidth && size > minPx) {
      size -= 1;
      heroTitle.style.fontSize = size + "px";
    }
  }

  fitHeroTitle();
  window.addEventListener("resize", fitHeroTitle);

  if (statusNode) {
    statusNode.textContent = labels.loading;
  }

  if (!isConfigured(config.csvUrl)) {
    if (statusNode) {
      statusNode.textContent = labels.loadError;
    }
    render([]);
    return;
  }

  fetch(config.csvUrl, { cache: "no-store" })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Bad response");
      }
      return response.text();
    })
    .then((csvText) => {
      const rows = mapRows(parseCsv(csvText));
      if (statusNode) {
        statusNode.textContent = labels.loaded;
      }
      render(rows);
    })
    .catch(() => {
      if (statusNode) {
        statusNode.textContent = labels.loadError;
      }
      render([]);
    });
})();
