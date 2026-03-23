const headerTextByLang = {
  fr: {
    main: "La gauche Française du <span class=\"header-highlight\">Mexique</span>",
    election: "Élections consulaires 2026",
  },
  es: {
    main: "La izquierda francesa de <span class=\"header-highlight\">México</span>",
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
