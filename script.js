(() => {
  const pages = [...document.querySelectorAll('.view')];
  const navButtons = [...document.querySelectorAll('[data-page]')];
  const goButtons = [...document.querySelectorAll('[data-go]')];
  const nav = document.querySelector('#nav');
  const menu = document.querySelector('.menu');
  const count = document.querySelector('#pageCount');
  let current = 0;

  function showPage(name, updateHash = true) {
    let index = pages.findIndex(page => page.id === name);
    if (index < 0) index = 0;
    current = index;
    pages.forEach((page, i) => {
      const active = i === current;
      page.classList.toggle('active', active);
      page.setAttribute('aria-hidden', String(!active));
      if (!active) page.scrollTop = 0;
    });
    navButtons.forEach(button => {
      const active = button.dataset.page === pages[current].id;
      button.classList.toggle('active', active);
      if (button.classList.contains('nav-link')) button.setAttribute('aria-current', active ? 'page' : 'false');
    });
    if (count) count.textContent = `${String(current + 1).padStart(2, '0')} / ${String(pages.length).padStart(2, '0')}`;
    if (updateHash) history.replaceState(null, '', `#${pages[current].id}`);
    if (nav) nav.classList.remove('open');
    if (menu) menu.setAttribute('aria-expanded', 'false');
  }

  navButtons.forEach(button => button.addEventListener('click', event => {
    event.preventDefault(); showPage(button.dataset.page);
  }));
  goButtons.forEach(button => button.addEventListener('click', () => showPage(button.dataset.go)));
  if (menu && nav) menu.addEventListener('click', () => {
    const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open));
  });
  document.querySelector('#prevPage')?.addEventListener('click', () => showPage(pages[(current - 1 + pages.length) % pages.length].id));
  document.querySelector('#nextPage')?.addEventListener('click', () => showPage(pages[(current + 1) % pages.length].id));
  window.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowRight') showPage(pages[(current + 1) % pages.length].id);
    if (event.key === 'ArrowLeft') showPage(pages[(current - 1 + pages.length) % pages.length].id);
  });
  window.addEventListener('hashchange', () => showPage(location.hash.slice(1), false));
  showPage(location.hash.slice(1) || 'home', false);
})();
