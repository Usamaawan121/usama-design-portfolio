# USAMA Design Portfolio — Version 3

## Best way to update an existing GitHub + Vercel project

Use **USAMA_Portfolio_V3_Copy_Paste_Update.zip** and copy its `site/`, `public/`, and `static-site/` folders into the existing `usama-design-portfolio/` directory. Choose **Replace existing files**, then use VS Code to run:

```powershell
npm run dev
npm run build
# after confirming all pages work
git add .
git commit -m "Redesign portfolio sections and interactions"
git push origin main
```

**Do not delete the Git repository or Vercel project.** The update overlay does not touch your `package.json`, `package-lock.json`, `node_modules`, `.git`, Next.js config, project metadata, or portfolio CV.

## V3 changes

- Refined editorial hero typography, animated 3D image stack, WebGL orbital sculpture, improved CTAs
- Featured Tummly section with premium photo-led presentation
- Redesigned philosophy statement with readable light typography, sculptural art and CTA
- Four animated discipline cards: Brand, UI/UX, Campaign, Motion
- More visual About section using the existing accurate biography
- Creative process hover lines and transitions
- Redesigned five-tool grid: Photoshop, Illustrator, After Effects, Figma, Canva
- Better contact CTA, mobile hierarchy, dark forest/ivory/sage color palette
- Case-study visual-gallery title and jump link, with zoom range and previous/next buttons
- Existing 20 project cards, filters, deep links and site animations retained

## Scope / asset integrity

This project continues to use editorial image references from the previous version; they're NOT fabricated screenshots of Tummly or Verendo. To replace a project image with your own authentic screenshot, edit `site/index.html` for featured cards, and `public/projects-data.js` + `lib/projects.json` for individual project pages. Current patch leaves those project records unchanged.

The enhanced 3D effects are interactive CSS perspective cards and the existing WebGL orbital effect. A separate GSAP/Three.js library was not introduced. They honor the operating system's reduced-motion setting. Real performance varies by device.

## Browser/testing limitations

The V3 markup and CSS were tested in an embedded Chromium preview at 1440px, 768px, 390px; all three had no horizontal overflow and no JavaScript page errors, the mobile menu opened, and UI/UX filter displayed five matching projects. Browser network restrictions prevented direct Next.js production deployment verification and full external-image-loading checks. Image zoom controls are implemented but the automated final interaction test timed out. Run `npm run build` and test image zoom, responsive layout, and navigation locally before pushing to your public portfolio.

## Full copy

**USAMA_Portfolio_V3_Complete_Source.zip** is provided as a recovery/standalone project, with `next` set to 15.5.28 and React/React DOM to ^19.2.1. This source was not package-installed or production-built here because npm registry access timed out. For your already deployed repository prefer the update patch, which preserves your known-working updated dependency versions and lockfile.
