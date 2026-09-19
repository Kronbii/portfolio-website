# Final targeted fix: mobile horizontal overflow

The live 390 × 844 browser check found horizontal overflow in shared authority components.

Evidence:

- `/projects/360-spherical-panorama-stitching`: viewport width 390, document scroll width 404.
- `/projects/omnisign-lebanese-sign-language`: viewport width 390, document scroll width 422.
- The overflowing descendants are `.stages` and `.stage` inside the “How the system works” section. The source list also reports content wider than its column on the 360 project/article, although the article document is currently clipped to 390.

Fix this in the shared new authority CSS/components only. Likely remedies include `min-width: 0` on grid/flex children, mobile-specific stage-grid collapse, and safe wrapping (`overflow-wrap: anywhere`) for long source/link text. Do not hide meaningful content, use global `overflow-x: hidden` as a bandage, reduce body text below a comfortable size, or modify any pre-existing file.

Acceptance at a 390 px viewport:

- `document.documentElement.scrollWidth === window.innerWidth` for:
  - `/projects/360-spherical-panorama-stitching`
  - `/projects/omnisign-lebanese-sign-language`
  - `/writing/building-a-360-panorama-stitcher-from-a-phone-sweep`
- Stage text and evidence links remain fully readable and wrap naturally.
- Desktop layout at 1440 px remains intact.
- Build, new-file ESLint, and additive-only diff checks still pass.

Update the implementation report with the verified width readings. Make no other design changes.
