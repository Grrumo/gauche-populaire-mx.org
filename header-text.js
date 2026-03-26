const headerTextByLang = {
  fr: {
    main: "<span class=\"header-bold\">Nouvelle gauche populaire et écologiste</span><br><span class=\"header-light\">La voix humaniste des Français·es du <span class=\"header-highlight\">Mexique</span></span>",
    election: "Élections consulaires 2026",
  },
  es: {
    main: "<span class=\"header-bold\">Nueva izquierda popular y ecologista</span><br><span class=\"header-light\">La voz humanista de las y los franceses en <span class=\"header-highlight\">México</span></span>",
    election: "Elecciones consulares 2026",
  },
};

const pageLang = (document.documentElement.lang || "fr").toLowerCase();
const langKey = pageLang.startsWith("es") ? "es" : "fr";
const currentText = headerTextByLang[langKey];

document.querySelectorAll(".js-header-main").forEach((el) => {
  el.innerHTML = currentText.main;
});

document.querySelectorAll(".js-header-election").forEach((el) => {
  el.textContent = currentText.election;
});
