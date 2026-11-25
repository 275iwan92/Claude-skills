---
name: ui-visual-qa
description: Use for ANY UI/UX work (screens, mockups, components, layouts, "tampilan", "desain", warehouse map, dashboards). Reference-driven build, screenshot comparison, and an automatic lint for overlapping, clipped, tiny or low-contrast text. Jo rates UI built from descriptions "SANGAT JELEK" next to ChatGPT mockups; this skill is the fix.
---
# ui-visual-qa

## Rule
UI is never done without (1) a reference, (2) `ui-lint` result with zero layout defects, (3) a screenshot compared side by side with the reference. Never write "not tested" for a screen.

## Workflow (max 3 fix rounds, then show Jo)
1. **JPEG gate (Jo's rule): no HTML/CSS/PHP/JS before an approved image exists.** The target is Jo's JPEG/PNG (usually from ChatGPT). No image yet: stop coding that screen, write the section list of the screen (step 2) in one message so Jo can get the image, and work on other tasks meanwhile; never invent the layout from text. Look at the image with Read.
2. **Spec in 10 lines**: list every section of the reference (header, KPI cards, tabs, main area, side panel, legend, actions) + colors + sizes. Missing sections are the usual reason a screen looks poor.
3. **Build** from DevLib2 components/tokens (`x-dl2::*`); no loose hex values or fixed-px text inside grid cells.
4. **Render** at 1440, 1024, 390 px and screenshot each. File pages cannot run scripts in the built-in browser: serve over http (`node` http server or the dev site).
5. **Lint**: inject `scripts/ui-lint.js` with the browser javascript tool, then read `window.uiLint()`. Targets: `text-overflows-box`, `text-clipped`, `text-overlap`, `short-label-wraps`, `tiny-text`, `page-h-scroll` = 0; `low-contrast` ratio >= 4.5; `small-target` >= 24 px.
6. **Compare** screenshot vs reference: sections present, hierarchy, spacing rhythm, colors, density, states. Fix, repeat.
7. **Show** Jo the screenshot next to the reference.

## Design rules (numbers, not adjectives)
- Spacing 4/8/12/16/24/32. Radius 12 cards, 8 controls, 999 pills. Shadow `0 1px 2px rgba(16,24,40,.06), 0 4px 12px rgba(16,24,40,.06)`.
- Type 12/14/16/20/28, weights 400/600/700, line-height 1.4; labels >= 12 px, body 14 px.
- Color: one primary, three status colors (green/amber/red), neutral grays; page bg `#f4f7fb`, cards `#fff`, dark navy sidebar.
- Page shape: title + one-line subtitle + context controls; KPI cards row (40 px icon tile, 12 px muted label, 24-28 px bold value); pill tabs; main area + 360 px right detail panel; footer legend and hint.
- Grids and maps: `grid-template-columns: repeat(var(--cols), minmax(0,1fr))`, `aspect-ratio`, `container-type: inline-size`, font `clamp(10px, 2.2cqw, 14px)`; one-line labels (`L01-04`, `nowrap`); stack count as a corner chip, never inline; zone title in a header bar with ellipsis + `title`; every state color matches the legend exactly.
- `min-width: 0` on flex/grid children; truncate with ellipsis, never let text escape its box.
- Detail panel: illustration, key-value list, status pill, item cards with drag handle, one full-width primary action, outline secondary actions.
