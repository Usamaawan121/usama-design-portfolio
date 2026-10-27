# Muhammad Usama — Visual Design / UI/UX Portfolio v2

This is the **second, revised** edition of the dark editorial portfolio, based on the provided visual reference. It includes 20 project entries, responsive layouts, interactive 3D perspectives, scroll-based depth, cinematic fades, image enlargement and a longer factual About page.

## Quick start (VS Code)

Node.js 20.9+ recommended. Run in the **project root**, where `package.json` lives:

```bash
npm install
npm run dev
```

Open http://localhost:3000, then run `npm run build` before deploying to Vercel. Deployment has **not** been executed from this environment.

## What's new in v2

- **Art direction:** black / deep forest background, fogged-sage accents, editorial `Instrument Serif` and understated `DM Sans`, natural grain and photography. Always-dark theme.
- **Hero:** a real WebGL 3D wireframe sculpture (mobile-adaptive FPS with graceful fallback), plus CSS 3D perspective (`preserve-3d`, `translate3d`, `rotateX`, `rotateY`) on three photographic layers, pointer-responsive camera movement, animated dimensional rings and spatial lighting.
- **Scroll:** progress line, smooth scrolling, reveal/fade/blur effects, parallax image depth and changing hero scale.
- **Project cards:** perspective tilt under mouse, glow and image zoom on hover; touch gets clean, readable controls with natural vertical scroll.
- **Case studies:** click any large case-study image to open the modal; plus/minus zoom, scroll-wheel zoom, drag/pan, mobile pinch and Escape-to-close.
- **20 projects:** Work category filters and case-study navigation retained.
- **About:** Aptech SFC graphic-design training; Photoshop, Illustrator, After Effects, Figma, Canva; software engineering at Aptech; UK SaaS experience at 5Sum working on Tummly. No fabricated design client history, fake reviews or project metrics.
- **Responsiveness:** layouts for mobile/tablet/desktop and `prefers-reduced-motion` support.

## Very important: real photography ≠ real client work

The old, synthetic illustration files have been removed. The new project gallery uses **actual editorial photographs from Unsplash**, loaded directly from `images.unsplash.com`. They are mood-reference photography, **not project screenshots, not photographs taken by Muhammad Usama, not real campaign deliverables**.

**Tummly and Verendo are real projects**, but we could not retrieve verified UI screenshots from their private/current app deployments in this session. Rather than fabricating screenshots, the project entries use appropriate real photographic imagery. Please replace these with your own screenshots for a genuinely authentic public-facing portfolio.

The other 18 projects are **speculative creative studies**, not verified commissioned work. The motion studies are still not actual After Effects videos. Do not claim that these are paid client campaigns or completed reels.

### Replace Tummly and Verendo with actual screenshots

1. Create authentic screenshots of Tummly and Verendo on your own desktop (with permission to share any client material).
2. Export `tummly-real.webp`, `tummly-detail.webp`, `verendo-real.webp`, `verendo-detail.webp` at ~1600px width and place them in `public/assets/`.
3. In `lib/projects.json`, `public/projects-data.js`, and `static-site/projects-data.js`, change each project's `cover` and `study` to e.g. `/assets/tummly-real.webp`. (In the static folder, the images must also exist in `static-site/assets/`.)
4. Run dev and confirm that the new images are displaying.
5. Update image descriptions/statuses if the images are truly captures of your live work.

Real case-study screenshot material you upload is far more persuasive to hiring managers than any commercial stock photo.

## Deploy

1. Push this full project folder to GitHub.
2. Vercel → Add New → Project → import repository.
3. Framework: **Next.js**. Root directory: project root.
4. Build command: `npm run build`, default Next.js output.
5. Verify all routes (`/`, `/work`, `/work/tummly`, `/work/verendo`, `/about`, `/contact`), mobile filter behavior, zoom modal, and CV download.

There is also an **independent, no-npm static version** in `static-site/` for a quick comparison. If deploying only the static version, set Root Directory to `static-site`, Framework `Other`, and the included `vercel.json` handles deep-link routing.

## Directory map

- `site/index.html` — canonical page HTML
- `site/styles.css` — original plus v2 editorial/motion design system
- `public/site.js` — navigation, filters, parallax, CSS 3D, image zoom, transitions
- `public/webgl-orbit.js` — native WebGL 3D orbit geometry and shaders, no external 3D runtime required
- `public/projects-data.js` — browser-side project content
- `lib/projects.json` — editable project inventory
- `public/assets` — add verified client imagery here
- `static-site/` — standalone deployable alternative

`site/index.html` is also loaded by the Next.js catch-all route. The browser project dataset is loaded before the interaction script.

## What was validated / not validated

- Static source was checked for 20 project entries, expected route sections, image source mapping and script syntax.
- **Offline DOM interaction tests passed** on 1440px, 768px and 390px viewports for project counts, category filtering, image-modal open/zoom/close, WebGL-script loading, dark palette, JavaScript exceptions and horizontal overflow. Photos were replaced with temporary blank stand-ins **only in the test harness**; the deployed website uses the Unsplash URLs.
- This tool environment blocked full external navigation to the dev server, so the real photo loading, website deployment and online end-to-end behavior must still be tested on your machine.
- Node modules could not be downloaded here; the Next.js production build is **not yet verified**.
- External Unsplash photos require internet; if some are unavailable, an accessible typography-based image fallback appears. For reliability, download and host the permitted original photographs locally after checking licensing/availability.

## Image credits and licensing

All gallery photographs are remotely referenced from `images.unsplash.com` (see `lib/projects.json` and `PHOTO-SOURCES.md`). Unsplash imagery is supplied as editorial placeholder/mood references. Check the original photo's license and any identifiable third-party branding/people before using it commercially. Replace remote assets with verified final assets for a professional public release.
