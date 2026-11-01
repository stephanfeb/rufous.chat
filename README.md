# rufous.chat

The public website for rufous: a single static page with no build step.

```
index.html            the landing page
assets/css/styles.css palette (taken from the app icon) and layout
assets/js/main.js     menu toggle, copy buttons, OS-aware download button; the page works without it
assets/img/           app icon sizes, favicons, the hummingbird illustration
```

## Run locally

```sh
python3 -m http.server 8000   # then open http://localhost:8000
```

## Deploy

Any static host works (GitHub Pages, Cloudflare Pages, Netlify): publish the folder as is.
Point `rufous.chat` at it; `index.html` already sets the canonical URL and Open Graph tags for that domain.

## Before launch

Placeholders to replace:

- `OWNER` in every GitHub URL (`grep -rn OWNER .`): the repository's real owner and name.
- `DOWNLOADS` in `assets/js/main.js` and the `data-platform` links in `index.html`: each platform's installer
  (`.dmg`, `.msi`/`.exe`, AppImage/`.deb`). They point to the latest release page until then.
- `https://rufous.chat/install.sh`: the install script shown in the hero and the download section.
  It has to exist at that URL.
- `#build` on the GitHub README: the anchor for build-from-source instructions.

Claims on the page and where they come from (checked 2026-11-02 against the repository):

- Measured numbers in "How it checks": `docs/changelog.md` in the rufous repository, readings
  of 2026-11-01 and 2026-11-02 (`bench/results/convo/4b_*`). Two 4B models, three to six runs
  each. Update them when new readings land, and keep the caveat line beside them.
- "2B–12B": the models the bench has run (gemma4:e2b to gemma4:12b). The README's older
  "1B–4B" is Mingbird's claim.
- The nine core tools are `core_tools()` in `crates/rufous-kernel/src/tools.rs`.
- Offline mode switches the cloud provider, the network tools and HTTP MCP servers off. It does
  not stop `run_bash` reaching the network, so the page no longer says "0 bytes leave".
- The desktop app is marked "not in the alpha": voice is behind the `voice` cargo feature and the
  Tauri bundle is off (`bundle.active: false`). The download buttons still promise macOS,
  Windows and Linux installers.
- Editors: only Zed is exercised (bead boubou-m64 covers the rest).
- The rufous hummingbird figures in the name story (about three grams, migration from Mexico to Alaska).
