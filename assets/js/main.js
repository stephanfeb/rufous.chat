// rufous.chat — progressive enhancements only; the page works without this file.

// Release links. Point each one at its installer once release builds exist.
const DOWNLOADS = {
  mac: { label: 'macOS', href: 'https://github.com/stephanfeb/rufous/releases/latest' },
  windows: { label: 'Windows', href: 'https://github.com/stephanfeb/rufous/releases/latest' },
  linux: { label: 'Linux', href: 'https://github.com/stephanfeb/rufous/releases/latest' },
};

function detectPlatform() {
  const ua = navigator.userAgentData?.platform || navigator.platform || navigator.userAgent || '';
  const s = ua.toLowerCase();
  if (/iphone|ipad|ipod|android/.test(navigator.userAgent.toLowerCase())) return null; // mobile: no desktop build
  if (s.includes('mac')) return 'mac';
  if (s.includes('win')) return 'windows';
  if (s.includes('linux') || s.includes('x11') || s.includes('cros')) return 'linux';
  return null;
}

function setupDownloads() {
  for (const [key, d] of Object.entries(DOWNLOADS)) {
    document.querySelectorAll(`[data-platform="${key}"]`).forEach((a) => { a.href = d.href; });
  }

  const platform = detectPlatform();
  const hero = document.querySelector('[data-download]');
  const label = document.querySelector('[data-download-label]');
  const others = document.querySelector('[data-other-platforms]');
  if (!hero || !label) return;

  if (!platform) {
    hero.href = '#download';
    label.textContent = 'Download';
    if (others) others.textContent = 'For macOS, Windows and Linux';
    return;
  }

  hero.href = DOWNLOADS[platform].href;
  label.textContent = `Download for ${DOWNLOADS[platform].label}`;
  if (others) {
    const rest = Object.keys(DOWNLOADS).filter((k) => k !== platform).map((k) => DOWNLOADS[k].label);
    others.textContent = `Also for ${rest.join(' and ')}`;
  }

  // Put the visitor's platform first in the download section.
  const primary = document.querySelector(`[data-platform="${platform}"]`);
  if (primary) {
    document.querySelectorAll('[data-platform]').forEach((a) => {
      a.classList.toggle('btn-primary', a === primary);
      a.classList.toggle('btn-ghost', a !== primary);
    });
    primary.parentElement.prepend(primary);
  }
}

function setupCopy() {
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const code = btn.parentElement.querySelector('[data-install]');
      if (!code) return;
      try {
        await navigator.clipboard.writeText(code.textContent.trim());
      } catch {
        const range = document.createRange();
        range.selectNodeContents(code);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        return;
      }
      btn.classList.add('is-copied');
      btn.setAttribute('aria-label', 'Copied');
      setTimeout(() => {
        btn.classList.remove('is-copied');
        btn.setAttribute('aria-label', 'Copy install command');
      }, 1600);
    });
  });
}

function setupNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.getElementById('nav-links');
  if (!toggle || !links) return;

  const setOpen = (open) => {
    links.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  toggle.addEventListener('click', () => setOpen(!links.classList.contains('is-open')));
  links.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && links.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
  });
}

setupNav();
setupCopy();
setupDownloads();
