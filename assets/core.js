(() => {
  const CONF = {
    title: 'Untitled document - Google Docs',
    alts: ['Untitled spreadsheet', 'Copy of Reading List', 'Class Notes', 'Google Classroom', ' School Tool', 'Class Link'],
    panic: 'https://classroom.google.com/h',
    mirrors: [
      '',                                        
      'https://google.com',
      'http://st4.schooltool.com/NewHartford/',
      'https://login.classlink.com/'
    ]
  };

  document.title = CONF.title;

  if (new URLSearchParams(location.search).has('404')) {
    document.body.classList.add('m404');
    document.title = 'Error 404 (Not Found)';
  }

  let gone = false;
  function panic() {
    if (gone) return;
    gone = true;
    document.title = 'Classroom';
    document.getElementById('panic')?.classList.add('on');
    setTimeout(() => location.replace(CONF.panic), 1200);
  }

  addEventListener('keydown', e => {
    if (e.key === 'Escape') panic();
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'x') { e.preventDefault(); panic(); }
  }, true);

  function cloak() {
    const w = window.open('about:blank', '_blank');
    if (!w) return alert('Popup blocked — allow popups for this site.');
    const base = location.origin + location.pathname.replace(/[^/]*$/, '');
    let html = '<!doctype html>' + document.documentElement.outerHTML;
    html = html.replace(/<head([^>]*)>/i, '<head$1><base href="' + base + '">');
    html = html.replace(/<script src="assets\/core\.js"><\/script>/, '');
    w.document.open(); w.document.write(html); w.document.close();
  }

  setInterval(() => {
    if (gone || Math.random() > .4) return;
    document.title = CONF.alts[(Math.random() * CONF.alts.length) | 0];
  }, 22000);

  document.addEventListener('click', e => {
    const a = e.target.closest('[data-act]');
    if (!a) return;
    const act = a.dataset.act;
    if (act === 'panic') panic();
    if (act === 'cloak') cloak();
    if (act === 'install' && window.__dp) { window.__dp.prompt(); window.__dp = null; a.hidden = true; }
  });

  if ('serviceWorker' in navigator) {
    addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }

  addEventListener('beforeinstallprompt', e => {
    e.preventDefault(); window.__dp = e;
    const b = document.getElementById('inst'); if (b) b.hidden = false;
  });

  const list = document.getElementById('mir');
  if (list) {
    list.innerHTML = '';
    CONF.mirrors.forEach((m, i) => {
      const li = document.createElement('li');
      const label = i === 0 ? 'current' : m.replace(/^https:\/\//, '').split('.')[0];
      if (i === 0) { li.innerHTML = '<span></span>'; li.firstChild.textContent = 'this host'; }
      else {
        li.innerHTML = '<a></a>'; const a = li.firstChild;
        a.href = m + location.pathname; a.textContent = label;
        a.target = '_self';
      }
      list.appendChild(li);
      if (i > 0) {
        const t0 = performance.now();
        fetch(m + '/icon.svg', { mode: 'no-cors', cache: 'no-store' })
          .then(() => { li.firstChild.dataset.ms = Math.round(performance.now() - t0) + 'ms'; })
          .catch(() => { li.firstChild.style.opacity = .35; });
      }
    });
  }

  window.__core = { cloak, panic };
})();
