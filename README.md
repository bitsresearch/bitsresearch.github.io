-

## Shared page and blog layout architecture

The website now has a single runtime source of truth for shared page chrome:

- `components/Layout.tsx` — site header, desktop/mobile navigation, accessibility controls, dark mode, TTS, skip navigation, back-to-top control, newsletter, and global footer. Every React page **and every blog post** is rendered inside this layout.
- `components/BlogPostPage.tsx` — the one reusable visual/semantic template for all blog posts. Do not copy a header/footer into individual posts.
- `content/blog-posts.json` — blog content and metadata. Add or edit posts here; the shared blog template supplies the layout automatically.
- `scripts/generate-static-html.mjs` — creates static HTML entry points after the Vite build so direct GitHub Pages visits and search engines can reach each route. The generated HTML is output, not a second source to edit by hand.

### Important maintenance rule

Never manually edit a generated `blog/<slug>/index.html` header, footer, accessibility menu, or navigation. Those files are rebuilt. To change the site-wide header/footer/accessibility experience, edit **only `components/Layout.tsx`**. To change the appearance/structure of every blog post, edit **only `components/BlogPostPage.tsx`**. To change one post's content or metadata, edit its entry in **`content/blog-posts.json`**.

This prevents accessibility fixes from being applied to the main site while older blog posts are accidentally left behind.
