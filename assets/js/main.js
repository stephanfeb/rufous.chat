// rufous.chat — progressive enhancements only; the page works without this file.

// The archive links are static in the page (GitHub's releases/latest/download/<asset>, the
// names release.yml publishes). This only puts the visitor's platform first.
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
  const platform = detectPlatform();
  if (!platform) return;
  const mine = [...document.querySelectorAll(`[data-platform="${platform}"]`)];
  if (!mine.length) return;
  const row = mine[0].parentElement;
  mine.reverse().forEach((a) => row.prepend(a));
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
