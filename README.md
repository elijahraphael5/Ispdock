# Ispdock

The ISPDock website (ispdock.com), built with Next.js (App Router) and exported as static files.

## Run it

```bash
npm install
npm run dev        # http://localhost:3010
npm run build      # static site in out/
npm run typecheck
```

`next build` writes plain HTML, CSS and JS to `out/` (`output: 'export'`), so any static host can serve it: Vercel, Netlify, nginx, S3.

## Where things are

- `app/layout.tsx` — fonts (`next/font`: Inter, Inter Tight, JetBrains Mono), metadata, and the tiny script that applies the saved light/dark choice before the first paint.
- `app/page.tsx` — the page, one component per section.
- `app/globals.css` — all styles (tokens, light and dark, layout, scenes).
- `components/` — sections (`Hero`, `Facts`, `Manifesto`, `Product`, `Spotlights`, `Network`, `Pricing`, `Compare`, `MoveOver`, `Faq`, `FinalCta`, `Footer`) and the moving parts:
  - `Nav` — mobile menu and the light/dark switch (remembered in `localStorage['ispdock-theme']`).
  - `Typed`, `Dashboard` — the typed hero word and the live example dashboard.
  - `scenes/PayScene`, `PortalScene`, `BrandScene` — the looping spotlight stories (GSAP), scaled by `useScene`.
  - `Globe` — the dotted, turning earth on the Network section's bottom edge (canvas, land data in `lib/land.ts`).
  - `ScrollMotion` — the scroll choreography (dashboard splitting into the menu boxes, heading reveals, stacking cards) and reveal on scroll.
- `lib/site.ts` — the contact address (`CONTACT`) and the plans. **Prices must match the platform's pricing sheet; change both together.**

Everything that moves stops while off screen and holds still when the device asks for reduced motion.
