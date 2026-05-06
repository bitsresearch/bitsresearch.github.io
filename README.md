# BITS | Building Identity through Stories Project Website

This export has been refactored from a hash-routed React/Vite single-page app into a GitHub Pages-friendly static multi-page build.

## Main changes

- Replaced `HashRouter` with `BrowserRouter`.
- Added real static page shells for routes such as `/about/`, `/what-we-care/`, `/research-update/`, `/team/`, and other existing pages.
- Added `.html` fallback page shells such as `about.html` for hosts or links that prefer file-based URLs.
- Kept the existing React UI, Tailwind styling, animations, Google Sheet CSV video loading, embedded videos, accessibility controls, and responsive behaviour.
- Added multi-page Vite build inputs in `vite.config.ts`.
- Removed hash-based canonical, Open Graph, and Twitter URLs.
- Added per-page static SEO metadata in each HTML shell.
- Added crawler-readable static HTML content inside each page shell so the main text, headings, navigation, links, and forms are present before JavaScript runs.
- Added `scripts/generate-static-html.mjs` to keep those HTML shells and built `dist/` pages index-friendly after every build.
- Updated `sitemap.xml` and `robots.txt` to use crawlable non-hash URLs.

## File structure

```text
/
├── index.html
├── about/index.html
├── about.html
├── what-we-care/index.html
├── what-we-care.html
├── research-update/index.html
├── research-update.html
├── team/index.html
├── team.html
├── output-resources/index.html
├── get-involved/index.html
├── contact/index.html
├── privacy-policy/index.html
├── terms-of-use/index.html
├── accessibility/index.html
├── research-ethics/index.html
├── upcomingworkshop/index.html
├── App.tsx
├── index.tsx
├── components/Layout.tsx
├── types.ts
├── vite.config.ts
└── public/
    ├── sitemap.xml
    ├── robots.txt
    └── googleabe3030756caa3c1.html
```

## Local development

```bash
npm install
npm run dev
```

## Build

For a root domain:

```bash
npm run build
```

The build command runs Vite first, then injects semantic static page content into the generated HTML files in `dist/`. To refresh the source HTML shells manually, run:

```bash
npm run seo:static
```

For a GitHub Pages project path, set your repository name as the base path:

```bash
VITE_BASE_PATH=/your-repository-name/ npm run build
```

The built site will be in `dist/`.

## GitHub Pages deployment

1. Push this project to GitHub.
2. In the repository, go to **Settings → Pages**.
3. Choose deployment from **GitHub Actions** or deploy the built `dist/` folder.
4. If using GitHub Actions, make sure the build command uses:

```bash
VITE_BASE_PATH=/your-repository-name/ npm run build
```

5. Set the publish folder to `dist`.

## Manual updates you may need

- Replace `your-repository-name` with the actual GitHub repository name.
- Replace the `https://bitsresearch.github.io` placeholder globally in each HTML page, `App.tsx`, `sitemap.xml`, and `robots.txt` once the final production domain is confirmed.
- Update `public/sitemap.xml` and `public/robots.txt` if the final domain changes.
