# rufous.chat

The public website for rufous: a single static page with no build step.

```
index.html            the landing page
assets/css/styles.css palette (taken from the app icon) and layout
assets/js/main.js     menu toggle, copy buttons, the visitor's platform first; the page works without it
install.sh            the installer served at https://rufous.chat/install.sh
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

- GitHub links go to `stephanfeb/rufous` (public since 2026-11-02).
- The download buttons and `install.sh` fetch `releases/latest/download/rufous-<target>.tar.gz`
  (and `.zip` for Windows) from `stephanfeb/rufous`. Those assets exist once a `v*` tag has
  run the repository's `release.yml`. Asset names live in three places: `release.yml`,
  `install.sh` and the `data-platform` links in `index.html`.

Claims on the page and where they come from (checked 2026-11-02 against the repository):

- Measured numbers in "How it checks": `docs/changelog.md` in the rufous repository, readings
  of 2026-11-01 and 2026-11-02 (`bench/results/convo/4b_*`). Two 4B models, three to six runs
  each. Update them when new readings land, and keep the caveat line beside them.
- "2B–12B": the models the bench has run (gemma4:e2b to gemma4:12b). The README's older
  "1B–4B" is Mingbird's claim.
- The nine core tools are `core_tools()` in `crates/rufous-kernel/src/tools.rs`.
- Offline mode switches the cloud provider, the network tools and HTTP MCP servers off. It does
  not stop `run_bash` reaching the network, so the page no longer says "0 bytes leave", and a
  note under "Bring your own model" says so.
- The desktop app is marked "not in the alpha": voice is behind the `voice` cargo feature and the
  Tauri bundle is off (`bundle.active: false`). The download buttons still promise macOS,
  Windows and Linux installers.
- Editors: only Zed is exercised (bead boubou-m64 covers the rest).
- The rufous hummingbird figures in the name story (about three grams, migration from Mexico to Alaska).

## Voice

The copy is written in Stephan's voice, as described in `twostack/www/VOICE.md`: "we" and "let's",
capitalised domain nouns (Tool Call, Turn, Record, Hold, Ring, Safety Gate), asides as
`<blockquote class="note">`, British spelling, no marketing words, no em-dash asides or semicolon chains.
