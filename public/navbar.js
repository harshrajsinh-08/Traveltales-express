document.addEventListener('DOMContentLoaded', () => {
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  let menuOpen = false;

  mobileToggle.addEventListener('click', () => {
    menuOpen = !menuOpen;

    if (menuOpen) {
      mobileMenu.classList.remove('opacity-0', '-translate-y-5', 'pointer-events-none');
      mobileMenu.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
    } else {
      mobileMenu.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
      mobileMenu.classList.add('opacity-0', '-translate-y-5', 'pointer-events-none');
    }
  });
});