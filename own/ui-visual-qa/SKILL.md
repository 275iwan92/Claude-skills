---
name: ui-visual-qa
description: Use for ANY UI/UX work (screens, mockups, components, layouts, "tampilan", "desain", warehouse map, dashboards). Reference-driven build, screenshot comparison, and an automatic lint for overlapping, clipped, tiny or low-contrast text. Jo rates UI built from descriptions "SANGAT JELEK" next to ChatGPT mockups; this skill is the fix.
---
# ui-visual-qa

## Rule
UI is never done without (1) a reference, (2) `ui-lint` result with zero layout defects, (3) a screenshot compared side by side with the reference. Never write "not tested" for a screen.

## Workflow (max 3 fix rounds, then show Jo)
1. **Image gate (Jo: show the design image first, then code).** No PHP/JS/production CSS before Jo has approved an image of the screen. If Jo gave an image, it is the target. If not, YOU make 2-3 static preview mockups (plain HTML/CSS rendered to a screenshot, or an inline widget), run the lint on them, and show them to Jo; never answer with only a list of sections and never ask Jo to fetch the image. Wait for his choice only on this screen, and keep working on other tasks.
2. **Spec in 10 lines**: list every section of the reference (header, KPI cards, tabs, main area, side panel, legend, actions) + colors + sizes. Missing sections are the usual reason a screen looks poor.
3. **Build** from DevLib2 components/tokens (`x-dl2::*`); no loose hex values or fixed-px text inside grid cells.
4. **Render** at 1440, 1024, 390 px and screenshot each. File pages cannot run scripts in the built-in browser: serve over http (`node` http server or the dev site).
5. **Lint**: inject `scripts/ui-lint.js` with the browser javascript tool, then read `window.uiLint()`. Targets: `text-overflows-box`, `text-clipped`, `text-overlap`, `short-label-wraps`, `tiny-text`, `page-h-scroll` = 0; `low-contrast` ratio >= 4.5; `small-target` >= 24 px.
6. **Compare** screenshot vs reference: sections present, hierarchy, spacing rhythm, colors, density, states. Fix, repeat.
7. **Show** Jo the screenshot next to the reference.

## Design rules (numbers, not adjectives)
- Spacing 4/8/12/16/24/32. Radius 12 cards, 8 controls, 999 pills. Shadow `0 1px 2px rgba(16,24,40,.06), 0 4px 12px rgba(16,24,40,.06)`.
- Type (Jo: bigger font, tighter spacing, easier to read, as in ChatGPT's version): page title 32-36 px bold; KPI value 32-36 px bold; table primary text 16-17 px semibold; body 15-16 px; secondary/labels 13 px (never below 12); weights 400/600/700; line-height 1.3; dark text on light, secondary gray >= 4.5:1 contrast. Tighter space: card padding 16-20 px, table row 56-64 px, gaps 12-16 px; make text bigger, not the whitespace.
- Color: one primary, three status colors (green/amber/red), neutral grays; page bg `#f4f7fb`, cards `#fff`, dark navy sidebar.
- Page shape: title + one-line subtitle + context controls; KPI cards row (40 px icon tile, 12 px muted label, 24-28 px bold value); pill tabs; main area + 360 px right detail panel; footer legend and hint.
- Grids and maps: `grid-template-columns: repeat(var(--cols), minmax(0,1fr))`, `aspect-ratio`, `container-type: inline-size`, font `clamp(10px, 2.2cqw, 14px)`; one-line labels (`L01-04`, `nowrap`); stack count as a corner chip, never inline; zone title in a header bar with ellipsis + `title`; every state color matches the legend exactly.
- `min-width: 0` on flex/grid children; truncate with ellipsis, never let text escape its box.
- Detail panel: illustration, key-value list, status pill, item cards with drag handle, one full-width primary action, outline secondary actions.

## Visual layer checklist (learned 2026-11-25 from Jays "Perawatan AC": Claude v1 vs ChatGPT; images in cases/)
Claude v1 had the right structure and clean data, but looked flat. ChatGPT added a visual layer. Every screen needs ALL of these before it is shown to Jo:
1. Icons: a 16-20 px line icon (one set, stroke 1.75, e.g. Lucide/Tabler inline SVG) on every nav item, KPI, tab, button, status chip, table column date/place. Never a plain square or letter tile as placeholder.
2. Figure/ground: tinted page background (soft blue gradient), white cards with radius 16-20 and layered soft shadow. White on white with a hairline border looks flat.
3. KPI cards tinted by meaning (blue/amber/red/green soft gradient) with a 40-48 px icon disc, value 28-32 px bold, and one decorative element at the right (mini chart or product illustration).
4. Domain imagery: product thumbnail or simple SVG illustration in the detail panel and sidebar footer (building/warehouse); empty sidebar space is filled, not left blank.
5. Table rows: leading icon tile, pin icon before place, calendar icon before dates, status chip with icon, row action menu (three dots), progress bar under the date in the risk color.
6. Tabs: icon + label + count in parentheses; search field at the right end of the tab row.
7. Top bar: page icon next to the title, notification bell, avatar. Sidebar: brand subtitle, gradient background, active item with icon and filled pill.
8. History/list items: colored icon circles (green check, red wrench) instead of plain dots; action buttons carry icons; primary button full width.
Keep from Claude v1: exact data, readable table, no overflow (ui-lint 0).

## Pitfalls found while building the sample (2026-11-25, cases/iac-maintenance-sample.html, lint 0 at 1440/1024/390)
- CSS class names collide (a dropdown class and a selected-row class were both `.sel` and wrecked the table): prefix component classes.
- Table cells need `white-space:nowrap` and explicit column budget (unit 180, area 100, date 130, status 110); wrap the table card in `overflow-x:auto` for phones.
- Grid/flex children need `min-width:0`, otherwise one wide table pushes the whole page sideways.
- Chip text colors on tinted chips must be dark shades (green #166534, amber #9a4607, red #b91c1c) to reach 4.5:1; primary blue start #2563eb, not #2f7bff.
- Headless check without the browser pane: serve over http, `chrome --headless=new --screenshot=out.png --window-size=1440,1060 URL`; lint via a copy of the page that appends ui-lint.js and prints `window.uiLint()` with `--dump-dom --virtual-time-budget=3000`.
- Illustrations: hand-drawn SVG objects (AC, vehicles, boxes) look amateur next to a rendered image. Take the object from the image Jo approved (crop it with a CSS background-position page and a headless screenshot, `mix-blend-mode:multiply` + radial mask to drop the white), or ask for a rendered asset; use SVG only for icons and simple shapes.

## Learned from ChatGPT v2 (cases/iac-maintenance-CHATGPT-TARGET-v2.webp)
- Product thumbnail in every table row (white tile with soft shadow), not an icon.
- Detail panel header = blue gradient band with the product popping out of it and overlapping the body; title white, status chip white on the band.
- Page background has soft light glows (radial gradients), sidebar bottom shows a photo of the building with a tagline, KPI cards carry a ghost icon (calendar, wrench) at 20% opacity.
- Month navigation arrows beside the schedule title. Crop photos/objects from the approved image; keep text real HTML.

## Elegant and professional (Jo, 2026-11-25: "next time you must be more elegant and more professional")
- Restraint: one primary blue, status colors only for status, at most 3 tints per screen; no decoration that carries no meaning.
- Alignment: one grid, columns and baselines line up across cards; equal gutters (16/24); same radius and shadow family everywhere.
- Consistency: one icon set and stroke weight, one chip style, one button height (44-52), numerals right-aligned in tables.
- Hierarchy: one focal point per screen; titles bold, labels muted; no more than 3 font sizes per card.
- Polish: hover/focus/selected states, empty and loading states, no clipped photo edges (feather or crop clean), real data lengths.
- Review as a stranger: if it looks like a template, remove an element before adding one.
