(() => {
  const button = document.querySelector('.js-scroll-top');
  if (!button) {
    return;
  }

  const toggleButton = () => {
    if (window.scrollY > 260) {
      button.classList.add('is-visible');
    } else {
      button.classList.remove('is-visible');
    }
  };

  button.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('scroll', toggleButton, { passive: true });
  toggleButton();
})();
