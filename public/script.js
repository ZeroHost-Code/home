/* ============================================================
   ZeroHost — script.js
   Scroll effects, FAQ, terminal typing
   ============================================================ */

/* ---------- NAVBAR SCROLL ---------- */
(function () {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();

/* ---------- HAMBURGER MENU ---------- */
(function () {
  const btn = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');
  if (!btn || !links) return;
  btn.addEventListener('click', () => {
    links.classList.toggle('open');
    btn.setAttribute('aria-expanded', links.classList.contains('open'));
  });
  /* Close when a link is clicked */
  links.querySelectorAll('.nav-link').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
})();

/* ---------- SCROLL REVEAL ---------- */
(function () {
  const sections = document.querySelectorAll('.section, .cta-section');

  sections.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05 }
  );

  sections.forEach(el => observer.observe(el));
})();

/* ---------- FAQ ACCORDION ---------- */
(function () {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      /* Close all */
      document.querySelectorAll('.faq-item.open').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      /* Open clicked if it was closed */
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();

/* ---------- TERMINAL TYPEWRITER ---------- */
(function () {
  const lines = [
    { type: 'cmd', text: 'node server.js' },
    { type: 'success', text: '[ZeroHost] Server started on port 3000' },
    { type: 'info', text: '[INFO] Listening for connections...' },
    { type: 'cmd', text: 'python bot.py' },
    { type: 'success', text: '[Bot] Connected as MyBot#1234' },
    { type: 'info', text: '[INFO] Commands loaded: 42' },
    { type: 'cmd', text: 'cargo run --release' },
    { type: 'success', text: '[Rust] Compiled in 1.2s — listening :8080' },
  ];

  const body = document.getElementById('terminal-body');
  if (!body) return;

  let lineIdx = 0;
  let charIdx = 0;
  let currentEl = null;
  let phase = 'typing'; // 'typing' | 'pause' | 'clear'
  let displayedLines = [];

  function mkLine(type) {
    const div = document.createElement('div');
    div.className = 'terminal-line';
    if (type === 'cmd') {
      div.innerHTML = '<span class="t-prompt">$</span> <span class="t-cmd"></span>';
    } else if (type === 'success') {
      div.className += ' t-success';
    } else {
      div.className += ' t-info';
    }
    return div;
  }

  function renderCursor() {
    /* Remove old cursor */
    const old = body.querySelector('.typed-cursor');
    if (old) old.remove();
    const cursor = document.createElement('span');
    cursor.className = 'typed-cursor';
    body.appendChild(cursor);
  }

  function tick() {
    const line = lines[lineIdx];

    if (phase === 'typing') {
      if (charIdx === 0) {
        currentEl = mkLine(line.type);
        body.insertBefore(currentEl, body.querySelector('.typed-cursor') || null);
        displayedLines.push(currentEl);
      }

      const target = line.type === 'cmd'
        ? currentEl.querySelector('.t-cmd')
        : currentEl;

      target.textContent = line.text.slice(0, charIdx + 1);
      charIdx++;

      if (charIdx >= line.text.length) {
        charIdx = 0;
        lineIdx = (lineIdx + 1) % lines.length;
        phase = 'pause';
        setTimeout(tick, lineIdx === 0 ? 1800 : 700);
        return;
      }
      setTimeout(tick, Math.random() * 40 + 25);

    } else if (phase === 'pause') {
      /* If we wrapped around, clear terminal */
      if (lineIdx === 0) {
        displayedLines.forEach(el => el.remove());
        displayedLines = [];
      }
      phase = 'typing';
      tick();
    }
  }

  /* Start after a short delay */
  body.innerHTML = '<div class="terminal-line"><span class="t-prompt">$</span> <span class="t-cmd"></span></div>';
  renderCursor();
  body.querySelector('.t-cmd').textContent = '';
  setTimeout(() => {
    body.innerHTML = '';
    renderCursor();
    tick();
  }, 800);
})();

/* ---------- SMOOTH ANCHOR SCROLL ---------- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-h')) || 72;
    const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ---------- HERO LETTER ROTATOR ---------- */
(function () {
  var words = [
    'NodeJS', 'Rust', 'Python', 'Java',
    'Uptime Kuma', 'Gitea', 'Forgejo', 'MariaDB',
    'Discord Bots', 'Minecraft', 'MongoDB'
  ];

  var wrapA = document.getElementById('wrap-a');
  var wrapB = document.getElementById('wrap-b');
  if (!wrapA || !wrapB) return;

  var current = wrapA;
  var next = wrapB;
  var wordIndex = 0;
  var ANIM = 400;
  var STAGGER = 50;
  var DISPLAY = 1200;
  var OVERLAP = 200;

  function makeLetters(word, container) {
    container.textContent = '';
    for (var i = 0; i < word.length; i++) {
      var span = document.createElement('span');
      span.className = 'word-rotator__letter';
      span.textContent = word[i];
      if (word[i] === ' ') span.innerHTML = '&nbsp;';
      container.appendChild(span);
    }
  }

  function enterLetters(container) {
    var letters = container.querySelectorAll('.word-rotator__letter');
    var maxTime = 0;
    for (var i = 0; i < letters.length; i++) {
      (function (el, idx) {
        setTimeout(function () { el.classList.add('enter'); }, idx * STAGGER);
      })(letters[i], i);
      maxTime = i * STAGGER + ANIM;
    }
    return maxTime;
  }

  function exitLetters(container) {
    var letters = container.querySelectorAll('.word-rotator__letter');
    var maxTime = 0;
    for (var i = 0; i < letters.length; i++) {
      (function (el, idx) {
        setTimeout(function () {
          el.classList.remove('enter');
          el.classList.add('exit');
        }, idx * (STAGGER / 2));
        maxTime = idx * (STAGGER / 2) + ANIM;
      })(letters[i], i);
    }
    return maxTime;
  }

  function transition() {
    var nextIndex = (wordIndex + 1) % words.length;
    var totalOut = exitLetters(current);

    setTimeout(function () {
      makeLetters(words[nextIndex], next);
      void next.offsetWidth;
      enterLetters(next);
    }, totalOut - OVERLAP);

    setTimeout(function () {
      current.textContent = '';
      var tmp = current; current = next; next = tmp;
      wordIndex = nextIndex;
      setTimeout(transition, DISPLAY);
    }, totalOut);
  }

  // Initial display
  makeLetters(words[0], current);
  void current.offsetWidth;
  var totalIn = enterLetters(current);

  setTimeout(transition, totalIn + DISPLAY);
})();

/* ---------- DYNAMIC COPYRIGHT YEAR ---------- */
(function() {
  const yearEl = document.getElementById('copyright-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();

/* ---------- GDPR COOKIE CONSENT ---------- */
(function () {
  const CONSENT_KEY = 'zerohost_cookie_consent';
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');
  const settingsLinks = document.querySelectorAll('.cookie-settings-link');

  function loadGoogleFonts() {
    if (document.getElementById('gfonts-preconnect')) return;
    const pc1 = document.createElement('link');
    pc1.rel = 'preconnect';
    pc1.href = 'https://fonts.googleapis.com';
    document.head.appendChild(pc1);
    const pc2 = document.createElement('link');
    pc2.rel = 'preconnect';
    pc2.href = 'https://fonts.gstatic.com';
    pc2.crossOrigin = '';
    document.head.appendChild(pc2);
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap';
    document.head.appendChild(css);
  }

  function removeGoogleFonts() {
    document.querySelectorAll('link[href*="fonts.googleapis.com"]').forEach(l => l.remove());
    document.querySelectorAll('link[href*="fonts.gstatic.com"]').forEach(l => l.remove());
  }

  function showBanner() {
    if (!banner) return;
    banner.classList.add('show');
  }

  function hideBanner() {
    if (!banner) return;
    banner.classList.remove('show');
  }

  function accept() {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    loadGoogleFonts();
    hideBanner();
  }

  function decline() {
    localStorage.setItem(CONSENT_KEY, 'declined');
    removeGoogleFonts();
    hideBanner();
  }

  if (acceptBtn) acceptBtn.addEventListener('click', accept);
  if (declineBtn) declineBtn.addEventListener('click', decline);
  settingsLinks.forEach(l => l.addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem(CONSENT_KEY);
    showBanner();
  }));

  const consent = localStorage.getItem(CONSENT_KEY);
  if (consent === 'accepted') {
    loadGoogleFonts();
  } else if (!consent) {
    showBanner();
  }
})();

/* ---------- INTERSECTION + SYMBOLS ---------- */
(function () {
  const dividers = document.querySelectorAll('.section-divider');

  dividers.forEach(divider => {
    const leftPlus = document.createElement('span');
    leftPlus.className = 'intersection-plus';
    leftPlus.style.left = 'calc(50% - 600px)';
    divider.appendChild(leftPlus);

    const rightPlus = document.createElement('span');
    rightPlus.className = 'intersection-plus';
    rightPlus.style.left = 'calc(50% + 600px)';
    divider.appendChild(rightPlus);
  });
})();

/* ---------- ROUGH NOTATION UNDERLINE ---------- */
(function () {
  const heroHighlight = document.getElementById('hero-highlight');
  if (heroHighlight && typeof RoughNotation !== 'undefined') {
    const annotation = RoughNotation.annotate(heroHighlight, {
      type: 'underline',
      color: '#ee8132',
      strokeWidth: 2.5,
      padding: 4,
      iterations: 2,
      animationDuration: 800
    });
    annotation.show();
  }

  const featuresHighlight = document.getElementById('features-highlight');
  if (featuresHighlight && typeof RoughNotation !== 'undefined') {
    const highlight = RoughNotation.annotate(featuresHighlight, {
      type: 'highlight',
      color: 'rgba(238, 129, 50, 0.2)',
      strokeWidth: 12,
      padding: 2,
      animationDuration: 600
    });
    highlight.show();
  }
})();


