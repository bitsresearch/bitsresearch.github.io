# Building Identity Through Stories

This repository contains the project website for **Building Identity Through Stories**, a doctoral research project by **Charlie Tak Hei Kwong 鄺德希** exploring how transmedia storytelling can support students with SEND in exploring identity during the transition into higher education.

🌐 **Website:** https://bitsresearch.github.io

## About

The website brings together information about the research, people involved, workshops, research ethics, opportunities to get involved, and project outputs and updates.

The site is built with **React, TypeScript, Vite and Tailwind CSS**, and deployed through **GitHub Pages**.

## Accessibility

The website is developed with reference to **WCAG 2.2 Level AA**. Accessibility is built into the main website rather than provided as a separate version, with features including keyboard navigation, visible focus, accessible colour contrast, responsive reflow, reduced-motion support, dark/light modes, text controls and optional Text-to-Speech.

## Shared Structure

The website uses shared components so changes remain consistent across normal pages and blog posts.

```text
components/Layout.tsx
→ shared header, navigation, accessibility tools and footer

components/BlogPostPage.tsx
→ shared template for every blog post

content/blog-posts.json
→ individual blog content and metadata
```

Site-wide elements should not be copied into individual pages. Shared changes should be made once in the relevant component.

## Development

```bash
npm install
npm run dev
npm run build
```

The build process generates static HTML for deployment and discoverability.

## Licence

Unless otherwise stated, project materials are shared under the terms shown on the website. Third-party materials, institutional logos, photographs and participant-created content may have separate copyright conditions.
