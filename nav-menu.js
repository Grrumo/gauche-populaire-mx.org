const mobileBreakpoint = window.matchMedia("(max-width: 768px)");

document.querySelectorAll(".js-menu-toggle").forEach((button) => {
  const navActions = button.closest(".nav-actions");
  const menu = navActions?.querySelector(".nav-links");

  if (!navActions || !menu) {
    return;
  }

  const closeMenu = () => {
    menu.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
  };

  const toggleMenu = () => {
    const isOpen = menu.classList.toggle("is-open");
    button.setAttribute("aria-expanded", isOpen ? "true" : "false");
  };

  button.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleMenu();
  });

  document.addEventListener("click", (event) => {
    if (!navActions.contains(event.target)) {
      closeMenu();
    }
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  const syncForViewport = () => {
    if (!mobileBreakpoint.matches) {
      closeMenu();
    }
  };

  if (typeof mobileBreakpoint.addEventListener === "function") {
    mobileBreakpoint.addEventListener("change", syncForViewport);
  } else {
    mobileBreakpoint.addListener(syncForViewport);
  }
});
