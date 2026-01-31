(function () {
  var toggle = document.querySelector('.nav-toggle');
  var panel = document.getElementById('nav-menu');
  var backdrop = document.getElementById('nav-menu-backdrop');
  var body = document.body;

  function isOpen() {
    return body.classList.contains('menu-open');
  }

  function openMenu() {
    body.classList.add('menu-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
    if (backdrop) backdrop.setAttribute('aria-hidden', 'false');
  }

  function closeMenu() {
    body.classList.remove('menu-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    if (backdrop) backdrop.setAttribute('aria-hidden', 'true');
  }

  function toggleMenu() {
    if (isOpen()) closeMenu(); else openMenu();
  }

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      toggleMenu();
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', function () {
      closeMenu();
    });
  }

  if (panel) {
    panel.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen()) closeMenu();
  });
})();
