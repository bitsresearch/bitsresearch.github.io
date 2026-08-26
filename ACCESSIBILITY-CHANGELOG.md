# BITS WCAG 2.2 AA Remediation Notes

Date: 24 August 2026

Content and SEO update: replaced the initial Falmouth map post with “Falmouth & Penryn Community Map 2026: GPS & Accessibility Guide”, using the approved short URL, search title, description, cover image, structured-data fields, sitemap entry and a contextual internal link from the Clearing guide. The initial draft URL now redirects to the final URL.

Accessibility update: added responsive, BITS-themed map and step-card styling; a titled, lazy-loaded Google Maps iframe; a direct map link; native expandable step sections; and descriptive alternative text for every new instructional image. The third-party Google Maps interface itself still needs manual keyboard and screen-reader testing.

Content update: the Falmouth University map post now includes the supplied inline filter/menu icon at `/images/menu-icon.png`, with descriptive alternative text.

Content update: added the blog post “Moving to Falmouth University in September 2026? Start With This Map”. Its phone guidance uses semantic ordered lists with continuous step numbers, and the embedded Google Map has a descriptive title and lazy loading.

Engineering update: static blog route generation now rebases the compiled CSS and JavaScript asset paths correctly. Direct blog links therefore render and hydrate correctly on GitHub Pages, while continuing to provide route-specific static content for search engines.

Content update: the People page profile now uses the approved concise BITS role statement and revised experience/research-focus paragraphs. No layout, interaction or accessibility behaviour was changed.

Update: the external Tailwind Play CDN has been replaced with a project-built CSS bundle. This removes the external render-blocking stylesheet dependency that can leave Meta's in-app browsers on a blank page when the CDN does not load.

Update: the app now safely handles unavailable `MutationObserver`, `matchMedia` and text-to-speech browser features, allowing the page to continue rendering instead of failing at startup in a restricted in-app browser.

Update: the academic-output `View` link now has a fixed minimum width, cannot shrink, and uses `white-space: nowrap`, preventing the word from splitting over two lines at high zoom.

Update: homepage FAQ questions now use `h3` under the section’s `h2`; detailed FAQ page questions remain `h4` under their category `h3` headings.

This is a reviewed copy of the website. The original uploaded ZIP was not changed. These changes reduce confirmed accessibility barriers, but they do not by themselves prove full WCAG 2.2 Level AA conformance.

## Confirmed issues fixed

- **300% zoom reflow — WCAG 1.4.10:** the About video is sticky only from the medium breakpoint upwards, so it no longer covers the text in a narrow zoomed viewport.
- **300% zoom navigation — WCAG 1.4.10:** mobile navigation and the accessibility panel now have a viewport-based maximum height and their own vertical scrolling. The back-to-top control is hidden while a menu is open.
- **Academic filters — WCAG 1.4.1 and 4.1.2:** the selected state is communicated with `aria-pressed`, a check icon and colour. A status message reports the result count.
- **Text contrast — WCAG 1.4.3:** FAQ count, research ethics call-to-action and form error colours were changed to combinations measuring at least 6.57:1 in the affected themes.
- **Visible label and accessible name — WCAG 2.5.3:** removed the conflicting accessible name from the “Upcoming Sessions” link.
- **Automatic 404 redirect — WCAG 2.2.1:** removed the seven-second meta refresh. The 404 page keeps its visible choices.
- **Off-screen carousel focus — WCAG 2.4.3 and 4.1.2:** non-visible workshop, research-video and community-resource slides are marked `inert` and `aria-hidden`.
- **Heading structure — WCAG 1.3.1:** corrected section and item heading levels on About, People, What We Care About, and Outputs and Resources.

## Full-stack and UX improvements

- Video and resource feed failures are now distinguished from genuine empty results.
- Removed the unrelated fallback video from the About page and replaced it with a clear unavailable message.
- Resource and workshop URLs loaded from CSV are limited to valid HTTPS URLs.
- `iframe` videos use lazy loading.
- Microsoft Forms destinations are visible in participation link text.
- Newsletter and contact messages no longer claim confirmed delivery when `no-cors` prevents the browser from checking the server response.
- Added short privacy explanations and links beside both forms.
- Changed “Output” navigation wording to “Outputs & Resources”.
- Added visible text to mobile accessibility controls.
- Added shared direct-entry accessibility styles so route entry pages retain reflow, focus, target-size and blog-reading rules.
- Optimised the profile image from about 3.3 MB to 0.7 MB and workshop gallery image 04 from about 0.6 MB to 0.18 MB in both deployment asset locations.
- Removed the unpublished `public/blog/Post-Name/index.html` template because it contained public placeholder metadata and a missing placeholder image. It remains recoverable from the original ZIP.

## Automated checks completed

- SEO/static-output validation passed for 12 canonical pages and the legacy redirects using a build-shaped test directory.
- HTML parsing passed for 40 source HTML files.
- Local HTML link and image target check found no missing targets.
- JSON files parsed successfully.
- Node syntax checks passed for both build scripts.
- Source delimiter and whitespace checks passed for modified TSX files.
- Contrast calculations passed for each changed colour pair: 6.57:1 to 8.18:1.

## Still requires manual testing

- Keyboard-only testing across every route, including focus order, focus visibility, menus, accordions, carousels and forms.
- Screen-reader testing with at least VoiceOver/Safari and NVDA/Firefox or NVDA/Chrome.
- Browser zoom/reflow at 200%, 300% and 400% on representative desktop and mobile viewport sizes.
- Text-spacing override testing against WCAG 1.4.12.
- Confirm captions, transcripts and audio description needs for every published video (WCAG 1.2.2, 1.2.3 and 1.2.5 as applicable).
- Test all external Microsoft/Google forms for keyboard access, labels, errors, time limits and mobile reflow; those services are outside this source ZIP.
- Confirm contact and newsletter requests reach the intended Google Apps Script destinations. The current `no-cors` transport cannot provide browser-verifiable delivery status.
- Review hero text contrast against every rotating background image at runtime.
- Test speech output in supported browsers; the built-in text-to-speech control is not a substitute for screen-reader support.

## Build verification and remaining limitations

- A production Vite build and the project’s SEO/static-output validation completed successfully after this update. A `package-lock.json` is included so the project can use `npm ci` in GitHub Actions and normal development.
- The generated site contains no Tailwind Play CDN references and links to its own versioned CSS asset instead.
- Meta’s Facebook and Instagram in-app browsers are controlled by Meta, so final testing from both apps is still required. This change removes the site-side condition most likely to cause the blank page, but cannot guarantee against an app or network fault outside the website.
- Because the manual tests above remain outstanding, this review does **not** claim that the website conforms to WCAG 2.2 Level AA.
