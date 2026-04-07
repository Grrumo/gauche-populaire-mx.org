/**
 * Auto-fit titles to prevent line breaks and overflow
 * Applies to: .hero h1, .events-hero h1, .trombi-board h2
 */
function fitTitle(element) {
  const maxPx = 86;
  const minPx = 26;
  let size = maxPx;
  element.style.fontSize = size + "px";

  while (element.scrollWidth > element.clientWidth && size > minPx) {
    size -= 1;
    element.style.fontSize = size + "px";
  }
}

function fitAllTitles() {
  const titleSelectors = [
    ".hero h1",
    ".events-hero h1",
    ".trombi-board h2"
  ];

  titleSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element) => {
      fitTitle(element);
    });
  });
}

// Initial fit when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", fitAllTitles);
} else {
  fitAllTitles();
}

// Refit on resize
window.addEventListener("resize", fitAllTitles);
