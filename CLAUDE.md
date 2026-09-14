# Portfolio — Project Requirements & Style Guide

This file is the source of truth for this project's goals, design direction, and
code conventions. Update it whenever a decision changes so it stays accurate —
don't let it drift from what the code actually does.

## 1. Purpose

A personal portfolio site for **Yong Xing Fu**, targeting **fintech** roles:
Software Engineer, Data Analyst, Business Analyst.

**Live site:** https://yongxingfu.netlify.app — deployed via Netlify,
auto-deploying from `main` on [github.com/YongXing58/Portfolio](https://github.com/YongXing58/Portfolio).
Any future change just needs a `git commit` + `git push` to go live.

Primary audience is
recruiters/hiring managers scanning quickly, so content must be scannable first,
detailed second (brief format now; more depth added over time).

## 2. Tech Stack

- **Astro** — static-first, ships ~0 JS by default. Chosen for load speed; a
  resume/project site has no need for a client-side app framework.
- **Tailwind CSS** — utility-first styling, no separate CSS-file sprawl.
- **TypeScript** — used for the data layer (`src/data/resume.ts`) so resume
  fields are type-checked wherever they're consumed.
- Interactive islands (React/Svelte) only if a future feature genuinely needs
  client-side state (e.g. a filterable project grid). Default to plain Astro.
- Hosting target: Vercel or Netlify (static build + CDN).

## 3. Design Direction

**v2 — "Comic Paper" (current).** The user explicitly asked to completely
replace the original "Dark Tech Sleek" direction (§3 below is the full
replacement, not an iteration on it): white/black base with a splash of
color, warm hand-drawn paper aesthetic, comic-panel-style sections, playful
custom illustration accents, mouse-reactive/animated throughout — "not just
a boring plain design." Treat this as the standing brief for all future
visual work on this site, not a one-off request.

**v2.1 — added on top of v2 (current):** the user asked for three more
things, all now implemented — (1) each section should feel like its own
"page" that the scroll settles onto one at a time rather than free-flowing
past everything, with a distinct entrance animation per section; (2) a
unique, cartoony custom cursor instead of the OS default; (3) more life
overall — shaking/reactive hover and click states beyond a plain
pop-with-shadow. See "One section at a time," "Custom cursor," and "Click
& hover micro-interactions" below.

**Palette — "Comic Paper"**
- Paper (background/panels): `paper-50 #FFFDF8` (page bg), `paper-100
  #FFF8EA` (panel bg), `paper-200 #F4E9D0` (border tint)
- Ink (text/borders/shadows): `ink-900 #161311` (primary text, all borders,
  hard shadows), `ink-700 #4A4038` (secondary text), `ink-400 #8A7F72`
  (meta/tertiary text)
- Splash accents (used sparingly — badges, underlines, stars, tag rotation
  — never as large fills): `splash-red #F0483E`, `splash-blue #3A86C8`,
  `splash-yellow #F6BE3B`
- Page background carries a "print misregistration" halftone: the main ink
  dot grid plus two faint colored dot layers (red, blue) each offset by a
  few px — like CMYK plates slightly out of alignment, a classic comic-
  print look. All `radial-gradient`, no image asset.
- Each section also has one large soft radial-gradient color wash
  (`.bg-blob` + a `.bg-blob-{red,blue,yellow}` modifier) bleeding from a
  corner past the `max-w-5xl` content column into the page margins — this
  is what keeps the page from reading as flat white beyond just the
  halftone grid. See the ⚠️ **known trap** under "One section at a time"
  below before touching `.bg-blob` — it must stay a plain gradient, never
  a solid fill + `filter: blur()`.

**Typography**
- Display/headings: `Permanent Marker` — big, bold, comic marker lettering.
  The one deliberately different display face; keep it that way.
- Body copy AND hand accents: `Caveat` — **the same family**, on purpose.
  `font-body` and `font-hand` are two Tailwind tokens that both resolve to
  Caveat (see `tailwind.config.mjs`) — kept as two token names for
  semantic clarity in markup, not two typefaces. History: started as
  `Inter` (v2), briefly became `Comic Neue` (v2.2) when the user asked for
  every body-text font to change, then became Caveat (v2.3) when the user
  said that was "too many different fonts" and asked body copy to match
  the Hero subhead's font instead. **Don't reintroduce a third body
  typeface** without checking with the user — this has already flip-
  flopped twice.
- Meta/dates/tags: `Space Mono` — the other deliberately different face,
  used only for small functional labels (dates, tags, chapter badges).
- Because Caveat is cursive, hierarchy inside a block of body text comes
  from **size and weight, not font family** — see "Type hierarchy inside
  a card" below. `body` defaults to `font-medium` (500) with
  `line-height: 1.65`; regular 400 reads too thin in this face at normal
  sizes.

**Type hierarchy inside a card (why this matters — read before adding
body text anywhere):** once body copy and accent copy are the same
cursive font, two lines of different *semantic* weight can look
*visually* identical unless you deliberately separate them by size/weight.
This is exactly what went wrong in `ProjectCard.astro` before the fix: the
one-line `summary` and the longer `description` were both small and the
same weight, so a recruiter skimming a project card couldn't tell them
apart. Fixed pattern (reuse this ratio on any new body text that needs a
"headline + detail" relationship, not just projects):
- Headline/summary line: `font-hand text-xl font-bold text-ink-900
  sm:text-2xl`
- Supporting/detail paragraph: `text-base font-medium text-ink-700/90
  sm:text-lg`
That's roughly one full Tailwind size step apart, plus bold vs. medium,
plus full-ink vs. muted-ink color — three signals stacked, not just one,
so it survives even if someone later tweaks a single property.

**The comic panel system (this is the core visual language — reuse it,
don't invent new card styles):**
- `.panel` (`global.css`) — paper card, 3px ink border, hard offset shadow
  (`shadow-comic`, no blur — flat comic-ink shadow), independent rotation
  per position across **four** `nth-of-type` buckets (not just odd/even —
  reads less mechanical) for a hand-placed feel. On hover: straightens,
  lifts, scales up slightly, shadow grows. Also mouse-reactive: a
  site-wide script in `BaseLayout.astro` applies a subtle 3D tilt following
  the cursor within each `.panel`.
- `.panel-tape` — opt-in modifier alongside `.panel` (`::before` pseudo-
  element) that adds a washi-tape corner accent, alternating side/color
  via `nth-of-type`. Used on larger cards (Experience, Education,
  ProjectCard, the Footer contact panel) but deliberately **not** on the
  small Certifications list rows, where it would look cluttered — treat
  that as the dividing line for future cards: one-per-row hero content
  gets tape, dense list rows don't.
- `.tag-pill` — sticker badge, ink border, hard shadow, rotates through the
  three splash colors via `nth-of-type` so a group reads as hand-applied
  stickers, not a uniform grid.
- `.comic-btn` — CTA button with a hard shadow that visually "presses in"
  on `:active` (shadow disappears, button shifts down-right).
- `.section-label` — rounded sticker tag (yellow, continuously swaying) used
  as the eyebrow label above every section heading, always paired with:
  - `.chapter-badge` — small "CH. 0N / 06" pill next to the label. Numbers
    are hardcoded per section (Hero=01 … Footer=06) rather than computed,
    because Certifications can self-omit if `resume.certifications` is
    ever empty — if that happens the numbering will be slightly off by
    one for Projects/Contact. Acceptable known limitation; not worth the
    complexity of making it dynamic for a portfolio only one person edits.
  - `.narration-caption` — one italic hand-written line above the label
    ("Our story begins...", "Meanwhile, on the job...", etc.) — comic-
    style narration captions, purely decorative copy, one per section.
- `.progress-dot` — scroll-progress indicator dots in the header
  (`lg:` screens only), one per rendered top-level section. Lit via a
  dedicated `IntersectionObserver` in `BaseLayout.astro` (rootMargin
  `-45% 0 -45% 0`, so whichever section crosses the vertical center of the
  viewport is marked active) — independent of the mouse-effects gate,
  since this is plain scroll tracking useful on touch too.
- `.doodle-underline` — hand-drawn wavy SVG stroke under the hero name,
  animates in (stroke-dashoffset draw-on) when revealed on scroll.
- Hand-drawn animated SVG doodles, one or two per section, each finance/
  tech themed and tied to that section's content: star + scribble arrow +
  dollar coin (Hero), growth chart (Experience), lightbulb (Skills),
  padlock (Certifications), code brackets `</>` (Projects), waving
  stickman (Contact/Footer). All `aria-hidden`, `pointer-events-none`,
  animated with the existing `animate-float`/`animate-wiggle` utilities.

  ⚠️ **Known trap:** position these doodles so they bleed *outside* the
  section's content column (negative offset, e.g. `-left-6`/`-right-6`,
  same technique as `.bg-blob`), not with a small positive inset like
  `right-4`. A positive inset sits *inside* the column, where it silently
  renders behind whatever panel/grid is at that position (panels come
  later in DOM order and are opaque) — this shipped once already on four
  different doodles and looked like they were simply missing. Also keep
  them below roughly `top-24`/`top-28`: because `scroll-snap-align: start`
  puts a section's top edge exactly at the viewport top when snapped to,
  anything placed nearer the top than that sits under the sticky header.
  On mobile there's no margin to bleed into at all, so these use `hidden
  sm:block` rather than rendering clipped/overlapping on narrow screens.
- `#running-stickman` (`BaseLayout.astro`) — a stickman that continuously
  jogs left-to-right across the **entire viewport** on a 13s loop
  (`position: fixed`, so it runs over whatever section is in view, not
  tied to one section like the doodles above). Pure CSS, no JS dependency:
  `animation: run-across` handles the horizontal traverse, and two
  overlapping leg/arm pose groups (`.frame-a`/`.frame-b`) toggle via
  opacity on a faster independent loop to fake a running cadence — cheap
  (opacity only, no transform math on individual limbs) and reliable.
  `z-40`, `pointer-events: none`, sits below the header (`z-50`) and the
  cursor mascot/click-burst (`z-998/999`). Explicitly `display: none`
  under `prefers-reduced-motion` (not just frozen) — a static stickman
  stuck at a random point on screen would read as a bug, not a choice.
- `#ladder-climb` (`BaseLayout.astro`) — a second, distinct stickman that
  climbs a diagonal ladder spanning the **entire viewport**, bottom-left
  to top-right, up and back down, endlessly, at every viewport size
  (`position: fixed; inset: 0`). Went through two design iterations
  worth knowing about before touching this element again:
  - **v1** was a narrow ladder confined to the right margin outside the
    `max-w-5xl` column, hidden below `xl:` (1280px) so it would never
    have room to overlap content. The user couldn't see it at all on a
    ~576px browser window — that breakpoint was far too conservative for
    how people actually size their windows.
  - **v2 (current)** spans the full width instead (per a follow-up
    request: "climb across the screen... diagonally... increasing in a
    slope"), and safety from overlapping content comes from **paint
    order**, not from hiding at small sizes.

  Two parts, both always rendered:
  - The ladder rails/rungs: plain SVG `<line>` elements, low opacity,
    drawn once, static, `viewBox="0 0 1000 600"` spanning the full
    container.
  - The climbing figure: a `<g>` **inside that same `<svg>`**, animated
    with native SMIL (`<animateTransform type="translate" ...>`) rather
    than a separately CSS-animated sibling element. Deliberate — putting
    the figure in the *same viewBox coordinate space* as the rails
    guarantees it tracks the exact diagonal they're drawn on; tuning two
    independent animations to agree on the same slope is fragile and was
    rejected during design for that reason. `values="70,555; 950,45;
    70,555"` with `keyTimes="0; 0.5; 1"` handles the up-then-down loop in
    one animation. Limb alternation reuses the running stickman's
    `stride-a`/`stride-b` opacity-toggle keyframes on nested
    `.climb-frame-a`/`.climb-frame-b` groups — don't duplicate those
    keyframes for a third mascot if one gets added later.

  ⚠️ **Known trap (got this backwards once, shipped it, had to fix it):**
  making a `position: fixed` element sit *behind* normal in-flow content
  requires a **negative** `z-index` — `z-index: 0` does **not** mean
  "same layer as unpositioned content." Per the CSS2 stacking/painting
  order spec, positioned descendants at stack level 0 paint **after**
  (on top of) non-positioned in-flow content, not alongside it — DOM
  order between them is irrelevant once one of them is explicitly
  positioned with a z-index. `#ladder-climb` originally used `z-index:
  0` reasoning "it's earlier in the DOM and at the same level as
  auto-z-index panels, so DOM order will make later content paint on
  top" — that reasoning is wrong, and the visible result was the
  climbing figure and ladder rails drawing on top of page text. Fixed by
  using `z-index: -1` (stack level 2 in the painting order, definitively
  before/behind step 3's in-flow content). If a future "background,
  fixed, behind content" decorative element is added, start with a
  negative z-index and verify by scrolling it through a text-heavy
  section, not by reasoning about DOM order.
  - SMIL animations are **not** covered by the global
    `animation-duration` override that handles `prefers-reduced-motion`
    for everything else — `#ladder-climb` has its own explicit
    `display: none` rule under that media query for exactly this reason;
    if you add a third SMIL-animated element, it needs the same explicit
    rule, the general CSS-animation guard won't catch it.

**Motion — the site should feel reactive, not static:**
- Scroll-reveal on every `.reveal` element (fade + slide + slight scale),
  staggered per sibling, via the `IntersectionObserver` script in
  `BaseLayout.astro`.
- Mouse-reactive tilt on every `.panel` (see above).
- `.comic-btn` / `.tag-pill` hover states — see "Click & hover
  micro-interactions" below; these are no longer a plain lift+shadow.
- All mouse-driven effects are **gated behind `hover: hover` and
  `pointer: fine` media queries** (skipped on touch) and **fully disabled
  under `prefers-reduced-motion: reduce`** (see the guards at the bottom of
  `global.css` and the top of each script) — reactive chrome must never
  become the only way to perceive content, and must never run where it'd
  just drain a phone battery for no visual benefit.
- No-JS fallback: if the reveal script fails to load, `.reveal`/
  `.section-enter` content stays fully visible (CSS rule keyed off a
  `.js-reveal-ready` class added synchronously in `<head>`) rather than
  staying hidden forever.

**One section at a time — desktop only.** Every top-level
`<section>`/`<footer>` carries `.snap-section` (`scroll-snap-align:
start`, `min-height: 100vh` with a `100dvh` companion for mobile browser-
chrome-aware height — see below) and `html` sets `scroll-snap-type: y
proximity`. `proximity`, not `mandatory`, on purpose — a section taller
than the viewport never traps the scroll fighting the user; it snaps when
comfortably close to a boundary and otherwise just flows.

⚠️ **Known trap (this one shipped to production once):** `proximity`
snap sounds gentle enough to also work on touch, but it isn't — CSS
scroll-snap fighting a touch device's momentum-scroll physics is a
well-documented mobile issue, and the user hit exactly the symptom it
causes: "can't scroll midway, it keeps jumping back to the top or bottom
of a section." The fix is **not** trying to tune snap thresholds — it's
turning snap off for touch entirely:
```css
@media (pointer: coarse), (max-width: 767px) {
  html { scroll-snap-type: none !important; }
}
```
Both conditions are there on purpose: `pointer: coarse` is the correct
semantic check, but `hover`/`pointer` media features have been observed
reporting inconsistently in at least one testing environment this project
uses, so the width clause is a belt-and-suspenders fallback. **Never
re-enable scroll-snap for touch/narrow viewports** without re-testing an
actual mid-scroll stop on a touch-emulated viewport (not just eyeballing
snapped section boundaries) — the failure mode only shows up when you try
to stop *between* sections, which is easy to not think to test.

Disabled entirely under `prefers-reduced-motion` too (separately from the
touch rule above).

Each section also carries `.section-enter` + a `data-anim` attribute for a
bigger, distinct entrance sweep as it's approached — layered underneath
the smaller per-panel `.reveal` stagger already inside it, so scrolling
between sections feels like turning a comic page, not just a fade:
- Hero (`#about`): `rise`
- Experience: `slide-left`
- Skills & Education: `slide-right`
- Certifications: `drop`
- Projects: `flip`
- Contact/Footer: `rise`

Both `.reveal` and `.section-enter` are driven by the *same*
`IntersectionObserver` in `BaseLayout.astro` (selector
`'.reveal, .section-enter'`) — don't add a second observer for new motion,
extend this one.

⚠️ **Known trap:** don't give `.snap-section` (or any section wrapper)
`display: flex`/`grid`. A flex/grid container "blockifies" its direct
children per the CSS box-generation spec — it silently turns any
inline-block child (e.g. `.section-label`) into a full-width block. This
broke the hero label once already; `.snap-section` deliberately has no
`display` override, and vertical rhythm comes from each section's own
padding instead. If a section ever needs its content vertically centered,
center an *inner wrapper div*, not the section element itself.

⚠️ **Known trap:** don't give `.bg-blob` (the per-section background color
wash, see Palette above) a solid fill + `filter: blur()`, even though
that's the more obvious way to get a soft glow. A handful of large
(300–400px) elements with `blur-3xl` turned out to be expensive enough to
composite — combined with `scroll-snap-type` and the mouse-tilt transforms
on `.panel` — that it caused real paint stalls/glitches while scrolling
(content correct in the DOM/a11y tree, but visibly failing to paint on
screen). `.bg-blob` is a plain `radial-gradient` with a transparent edge
instead — visually just as soft, effectively free to composite. If a
future decorative element needs a "glow," reach for a gradient before a
blur filter, and if you must use `filter: blur()`, test scrolling
performance with it before committing.

**Custom cursor.** `#cursor-char` in `BaseLayout.astro` is a small
star-mascot SVG (reuses the hero star's path) that trails the real pointer
with a lerp, drawn with two swappable face groups (`.face-idle` /
`.face-hover`, toggled via the `.is-hover` class) — idle is a calm smile,
hover (over any `a`, `button`, or `.panel`) is a wide-eyed excited face and
the mascot grows ~35%. `.is-active` (mousedown) shrinks it slightly for a
little "press" feel. The OS cursor is hidden (`cursor: none`) only via the
`html.custom-cursor-active` class, which JS adds *only* after confirming
`hover:hover` + `pointer:fine` + no reduced-motion — never hide the real
cursor by default in CSS alone.

⚠️ **Known trap:** the element starts with a literal `class="hidden"` in
the markup (Tailwind's `.hidden` utility, toggled by `classList` in the
script) — do **not** move that `hidden` into the `#cursor-char { @apply
... }` CSS rule instead. Baking `hidden` into an ID-selector rule makes
`display:none` permanent for that ID, and `classList.remove('hidden')`
then does nothing because the element never had the class to begin with.
This exact bug shipped once already; the fix was moving `hidden` onto the
element and out of the `@apply` list.

**Click & hover micro-interactions (beyond pop + shadow):**
- `.tag-pill:hover` — a quick jiggle/shake keyframe (`tag-shake`, plain
  CSS, not a Tailwind utility since it's pseudo-class-triggered), not a
  translate.
- `.panel:hover` — tilt (mouse-reactive, see above) *plus* a slight
  `scale(1.015)` bump layered on top of the lift+shadow.
- `.comic-btn` click — spawns 6 little star (★ / ✦) particles from the
  click point that fly outward on random angles and fade
  (`.click-burst-particle` + `burst-particle` keyframe, spawned/removed by
  a `document`-level click listener in `BaseLayout.astro` — delegated, so
  it automatically covers every current and future `.comic-btn`, no
  per-button wiring needed).
- `.section-label` has a continuous slow `sway` idle animation (tape-on-a-
  sticker flutter); bullet "✦/★" markers (`.bullet-star`) have a slow
  `twinkle` opacity/scale pulse. Both are subtle and infinite, gated by the
  same reduced-motion rule as everything else.

**Overall vibe:** unique, playful, hand-crafted — a comic book/zine feel
over generic template polish. Still built to be fast (no image assets, no
animation libraries, no heavy JS — everything above is vanilla CSS +
~100 lines of plain script) and still readable enough for a fintech
recruiter to scan the actual content, not just admire the chrome.

## 4. Content / Data Architecture

- **`src/data/resume.json`** is the single source of truth for all resume
  content: profile, experience, education, skills, projects, certifications.
- **`src/data/resume.ts`** wraps the JSON with TypeScript interfaces and
  derived exports (e.g. `featuredProjects`). Components must import from
  `resume.ts`, never read `resume.json` directly, so types stay enforced.
- Components are **dumb renderers** of this data — no resume content should
  ever be hardcoded into a `.astro` component. To add/edit resume content,
  edit `resume.json` only.
- Current data is placeholder (`TODO: ...` strings) pending real details from
  the user (LinkedIn access was blocked by a login wall — content was not
  scraped). Replace all `TODO` fields before shipping.
- If content grows (e.g. long-form project case studies, blog posts), migrate
  those specific pieces to Astro Content Collections (`src/content/`) with a
  Zod schema — keep `resume.json` for the structured, short-form data
  (experience bullets, skills, contact) that components iterate over directly.

## 5. Code Style Conventions

- **Components:** PascalCase filenames (`ProjectCard.astro`). One component,
  one responsibility — section components (`Hero`, `Experience`, `Projects`)
  compose smaller presentational components (`ProjectCard`).
- **Imports:** use path aliases (`@/`, `@data/`, `@components/`, `@layouts/`)
  defined in `tsconfig.json` — no deep relative `../../..` chains.
- **Styling:** Tailwind utility classes in markup; shared repeated utility
  combos get promoted to a `@layer components` class in `global.css` (see
  `.panel`, `.tag-pill`, `.comic-btn`, `.section-label`, `.link-underline`,
  `.doodle-underline`) rather than copy-pasted across files. New card/badge
  UI should extend the existing comic-panel system (§3), not invent a new
  visual style.
- **Colors:** always reference the semantic Tailwind tokens (`paper-50`,
  `ink-900`, `splash-red`, etc.) defined in `tailwind.config.mjs` — never
  raw hex values in component markup.
- **Data typing:** any new resume field must be added to the `Resume`
  interface tree in `resume.ts` before use, so TypeScript catches typos.
- **Accessibility:** semantic HTML (`<section>`, `<article>`, `<nav>`,
  `<header>`, `<footer>`), meaningful link text (no bare "click here"),
  respect reduced-motion (see above).
- **No client JS by default.** Only add a `<script>` or framework island when
  something genuinely requires interactivity/state; prefer CSS for anything
  animation-related.

## 6. Open Items / Next Steps

- [x] Profile, experience, education, skills, and certifications pulled from
      the user's LinkedIn (`linkedin.com/in/yongxingfu`) and populated into
      `resume.json`.
- [x] First project added: Tuition Centre Registration & Scheduling System
      (auto teacher/schedule assignment, conflict detection, payments,
      per-class promotions). More projects to be added by the user.
- [x] `projects[0].role` set — "Project Leader & Main Developer". Also now
      rendered on `ProjectCard.astro` (was previously in the data but not
      displayed — fixed).
- [x] `projects[0].date` set to "6 months" (duration given; exact calendar
      year not specified by user).
- [x] Project 2 added: Blockchain-Based Marketplace (MetaMask wallet
      sign-in, ETH transactions, add/buy listings, tx ID + user ID shown).
      Solo project, 2nd year at Republic Polytechnic (2022).
- [x] **No links for any project.** All project repos/demos lived under the
      user's school email, which was disabled after graduation — so
      `links` is `{}` for every project and stays that way unless the user
      later rebuilds/re-hosts something. `ProjectCard.astro` updated to
      hide the links row entirely when a project has none (previously left
      an empty div).
- [ ] **1 more project pending (deferred)** — user has 3 total; 2 are in
      `resume.json`. User asked to leave project 3 out for now — add when
      they provide it, no action needed until then.
- [ ] `profile.links.github` and `profile.links.website` still `TODO` —
      need the user's actual GitHub handle / personal site (if any).
- [ ] Add real `resumePdf` file to `public/resume.pdf`.
- [x] Scroll-reveal wired up — `BaseLayout.astro` sets up an
      IntersectionObserver over all `.reveal` elements (Experience,
      ProjectCard, Skills, Education, Certifications), fading/sliding each
      in once as it enters the viewport with a slight per-item stagger.
      No-JS and `prefers-reduced-motion` fallbacks both keep content
      visible (see `global.css`).
- [x] **Mobile nav fixed** — the header's nav links were `hidden sm:flex`
      with no mobile alternative at all (a real bug, not just missing
      polish). Added a hamburger toggle + slide-down menu for `<sm`
      viewports; verified working on a 375px viewport in the browser.
- [x] Added `scroll-margin-top` on all section anchors so the sticky header
      never overlaps a section heading when jumping via nav links.
- [ ] Decide on a contact form approach (Formspree/Resend) vs. mailto-only.
- [ ] Add OG image (`public/og-image.png`) and social meta tags.
- [x] `npm install` and `npm run dev` verified working (repeated checks after
      each data/content change).

## 7. Change Log

- **Initial scaffold** — Astro + Tailwind project structure created, Dark
  Tech Sleek design system applied, resume data layer + rendering components
  built with placeholder content pending user's actual resume details.
- **Real resume content** — profile, About summary, SBS Transit internship
  experience, SIT + Republic Polytechnic education, skills, and 6 licenses/
  certifications pulled from the user's LinkedIn (after they logged in) and
  written into `resume.json`. Added a `Certifications.astro` component
  (self-omits if the list is ever empty).
- **First project added** — Tuition Centre Registration & Scheduling System
  (booking, teacher assignment, conflict-free scheduling, payments,
  per-class promotions). Contact email switched to `yongxing937@gmail.com`
  per user request.
- **Project details filled in** — clarified this was a Final Year Project
  built for a real (anonymized, per user's choice) tuition centre client,
  not a generic school exercise; added "Final Year Project" / "Real Client"
  tags. Set role to "Project Leader & Main Developer" and fixed
  `ProjectCard.astro` to actually render the `role` field (was in the data
  schema but never displayed). Profile summary now notes 5+ years studying
  the fintech industry. User has 3 total projects — 2 more pending.
- **Second project added** — Blockchain-Based Marketplace, a final-year exam
  project: MetaMask wallet sign-in, ETH-settled transactions for listing/
  buying products, blockchain transaction ID + user ID shown per
  transaction. Solo project, 2nd year Republic Polytechnic (2022).
- **All project links removed** — user's school email (under which all
  project repos/demos lived) was disabled post-graduation, so no
  demo/repo/case-study links exist for any project. Set `links: {}` across
  the board and updated `ProjectCard.astro` to hide the links row when
  empty instead of rendering an empty div. 1 project still pending.
- **Deployed to Netlify** — repo pushed to GitHub
  (github.com/YongXing58/Portfolio), Netlify connected for git-based
  auto-deploy from `main`. Live at yongxingfu.netlify.app.
- **Scroll-reveal + mobile nav fix** — wired up IntersectionObserver-based
  reveal-on-scroll for all `.reveal` elements site-wide, with staggered
  timing, no-JS fallback, and reduced-motion support. Also fixed a real
  bug: the header had no working navigation at all on mobile (`sm:flex`
  with no fallback) — added a hamburger menu. Added `scroll-margin-top` so
  anchor-jump navigation doesn't get hidden under the sticky header.
- **Complete visual rebuild — "Comic Paper" replaces "Dark Tech Sleek."**
  User asked for a full UI/UX switch-up: white/black + a splash of color,
  warm hand-drawn paper aesthetic, comic-panel sections, playful custom
  illustration accents, mouse-reactive animation throughout. Rewrote
  `tailwind.config.mjs` (new palette, fonts, `shadow-comic` utilities,
  keyframes), `global.css` (halftone paper background, `.panel`/`.tag-pill`
  /`.comic-btn`/`.section-label`/`.doodle-underline` comic system,
  `#cursor-dot` styles), and every component (`Header`, `Hero`,
  `Experience`, `SkillsAndEducation`, `Certifications`, `ProjectCard`,
  `Projects`, `Footer`) to the new system. `BaseLayout.astro` now also
  drives a trailing cursor dot and per-panel mouse-tilt, both gated behind
  `hover:hover`+`pointer:fine` and disabled under reduced-motion. New fonts:
  Permanent Marker / Caveat / Inter / Space Mono (replacing Space Grotesk /
  IBM Plex Sans / IBM Plex Mono). Favicon updated to match. Verified build
  (0 errors) and live in-browser on desktop + 375px mobile, including the
  hover-tilt and mobile nav. See §3 for the full new design-direction spec.
- **v2.1 — one-section-at-a-time scroll, custom mascot cursor, more life.**
  Three more explicit asks: (1) scroll-snap so each section reads as its
  own "page" (`.snap-section` + `scroll-snap-type: y proximity` on
  `html`), with a distinct `.section-enter` sweep per section
  (slide-left/slide-right/drop/flip/rise) layered under the existing
  per-panel `.reveal` stagger; (2) replaced `#cursor-dot` with
  `#cursor-char`, a trailing star-mascot cursor with idle/excited face
  states and a press-down state, OS cursor hidden only once JS confirms
  fine-pointer + no-reduced-motion; (3) more reactive/lively
  micro-interactions — `.tag-pill` hover-shake, `.panel` hover now also
  scales slightly, `.comic-btn` clicks fire a 6-star particle burst,
  `.section-label` sways continuously and bullet stars twinkle.
  **Fixed two real bugs found during verification** (both now documented
  as "known traps" in §3 so they don't recur): `.snap-section` originally
  used `display:flex` to vertically center content, which CSS-blockified
  the hero's inline-block `.section-label` into a full-width block —
  removed the flex, centering now happens per-section via padding only;
  and the cursor mascot's `hidden` state was baked into the `#cursor-char`
  ID rule via `@apply hidden` instead of being a literal class on the
  element, so `classList.remove('hidden')` in JS was a no-op and the
  cursor never appeared — fixed by moving `hidden` onto the element itself.
  Verified: 0 build errors, full 6-section scroll-snap walkthrough,
  mascot idle/hover/active states, and click-burst all confirmed live in
  the browser on desktop; mobile (375px) confirmed no mascot cursor
  (correctly touch-gated) and natural scroll through the taller
  Skills+Education section.
- **Body font swap to Comic Neue + per-section background color washes.**
  User: layout/design is "not too bad" but the flat white background needs
  work, and wanted the body text font (About, Experience, Education,
  Certifications, Projects) changed from Inter — done sitewide via the
  `font-body` token. Added a "print misregistration" second/third halftone
  layer (faint red/blue dot grids, slightly offset) to the page background,
  plus one large soft radial-gradient color wash per section (`.bg-blob` +
  color modifier), bleeding from alternating corners past the content
  column into the margins.
  **Fixed a real, fairly serious bug found during verification:** the
  first version of `.bg-blob` used solid color fills + `filter: blur-3xl`,
  which was expensive enough to composite (combined with scroll-snap +
  the panel mouse-tilt) that it caused genuine paint stalls while
  scrolling — confirmed via `elementFromPoint`/computed-style checks that
  the DOM was correct while the screen simply failed to paint it, then
  isolated the cause by toggling `overflow-x` and blob styles live in the
  page. Replaced with a plain `radial-gradient` (`.bg-blob-{red,blue,
  yellow}`), which looks equivalently soft at effectively zero compositing
  cost — also more in line with the "lightning-fast" principle in §2.
  Documented as a new ⚠️ known trap in §3. Verified: 0 build errors, clean
  scroll-snap walkthrough through all 6 sections with no paint glitches on
  desktop, and a clean render on 375px mobile.
- **Built out all 5 previously-suggested ideas, plus body font unified to
  Caveat, plus hand-drawn animated doodles.** User approved every earlier
  suggestion ("chapter numbers," tape/torn-corner accents, narration
  captions, scroll-progress dots, more varied panel rotation) and asked
  for two more things: (1) stop using a 4th typeface for body copy — match
  the Hero subhead's font instead (Caveat replaces the short-lived Comic
  Neue; see the new Typography section above for the full history/
  rationale and the mandatory size/weight hierarchy rule that comes with
  putting body+accent text in the same cursive face); (2) hand-drawn,
  *animated* finance/tech doodles and a "characters/stickman" scattered
  around the page so it doesn't feel dead. Implemented:
  - `.chapter-badge` + `.narration-caption` on every section
  - `.progress-dot` scroll-tracker in the header (`lg:` only), wired to a
    dedicated `IntersectionObserver`
  - `.panel-tape` washi-tape corners on Experience/Education/Project/
    Footer cards (not Certifications' compact rows)
  - Four-bucket panel rotation instead of odd/even
  - Six new animated SVG doodles, one/two per section, each tied
    thematically to that section (coin, growth chart, lightbulb, padlock,
    code brackets, waving stickman)
  - `ProjectCard.astro`'s summary/description sizing fixed per the new
    hierarchy rule — this was the user's core complaint ("words under
    project... look really similar")
  **Fixed a real bug found during verification, on four separate
  doodles:** the first pass positioned each new doodle with a small
  *positive* inset (e.g. `right-4`), which placed it *inside* the
  section's content column — there it silently rendered behind whichever
  panel/grid occupied that position (panels come later in DOM order and
  are opaque), so four of six doodles were invisible or showing only a
  sliver. Fixed by repositioning all of them to bleed *outside* the
  column with a negative offset (same technique already used by
  `.bg-blob`), and pushed their vertical position down enough to clear
  the sticky header on sections reached via scroll-snap. Documented as a
  new ⚠️ known trap in §3. Verified: 0 build errors; walked all 6 sections
  confirming every doodle renders fully and un-occluded, the summary/
  description hierarchy reads clearly in both project cards, tape corners
  alternate correctly, chapter badges and captions appear on every
  section, progress dots track scroll position, and a clean render on
  375px mobile (with the negative-offset doodles correctly hidden below
  `sm:` where there's no margin to bleed into).
- **Running stickman.** User asked for a stickman that runs across the
  screen, distinct from the static waving one in the footer. Added
  `#running-stickman` — fixed-position, pure CSS (no JS), continuously
  jogs left-to-right on a 13s loop over whatever section is currently in
  view, with a genuine two-frame running stride (alternating leg/arm
  poses via opacity toggle) layered on top of the horizontal traverse
  rather than just sliding a static pose across. Explicitly hidden (not
  frozen) under `prefers-reduced-motion`. Verified: 0 build errors,
  confirmed running and changing stride mid-scroll on desktop (position:
  fixed keeps it on-screen across section changes); on mobile emulation
  confirmed via computed styles that `position: fixed` + `bottom: 1.75rem`
  is resolving correctly against the real (taller) emulated viewport
  height — the on-screen preview crops to a shorter height than that, so
  the stickman not appearing in a mobile screenshot was a tool display
  quirk, not a bug in the page.
- **Fixed a real mobile usability bug: scroll-snap was fighting touch
  scrolling.** User: on phone, "you can't scroll midway as you keep
  jumping back to top or bottom section" — the `proximity` scroll-snap
  from the "one section at a time" feature (added a few turns back) was
  assumed gentle enough for touch based on its behavior in desktop
  testing, but proximity snap vs. touch momentum-scroll physics is a
  known mobile issue and this is exactly its symptom. Fixed by disabling
  `scroll-snap-type` entirely under `@media (pointer: coarse), (max-width:
  767px)` — desktop keeps the snap experience, touch/narrow gets plain
  natural scrolling. Also switched `.snap-section`'s `min-height` to
  `100dvh` (with the existing `100vh` kept as a fallback), since `vh` not
  accounting for mobile browser chrome show/hide was likely compounding
  the "jumpy" feeling even apart from the snap fighting. Documented as a
  new known trap in §3 — this exact regression must not come back if
  scroll-snap tuning is revisited later. Verified: `scroll-snap-type`
  computed as `none` on a touch-emulated viewport and `y` (proximity) on
  a 1280px desktop viewport; confirmed an actual mid-scroll stop (scrollY
  landing on an arbitrary value, not a section boundary) holds steady
  with no snap-back on the touch viewport.
- **Ladder-climbing stickman.** User asked for a second stickman that
  climbs a diagonal ladder up and back down, with the ladder itself fixed
  in the background without interfering with content. Added
  `#ladder-climb`: static SVG ladder rails/rungs plus a climbing figure
  animated via native SMIL `<animateTransform>` inside the same `<svg>`
  (guarantees it tracks the rails' exact diagonal — see the full
  rationale in the new §3 bullet), alternating-limb climbing gait reusing
  the running stickman's stride keyframes, positioned in the right margin
  outside the content column and hidden below `xl:` (1280px) where that
  margin doesn't reliably exist. Explicitly hidden under
  `prefers-reduced-motion` via its own rule, since SMIL isn't covered by
  the CSS `animation-duration` override used for everything else.
  Verified: 0 build errors; watched the figure track the ladder's exact
  diagonal from bottom to top on a 1440px viewport with no drift, content
  fully clear of the ladder/climber at all times, no console errors.
- **Ladder redesign — full-width, and a real stacking-order bug fixed.**
  User feedback in two parts: (1) "I don't see any climbing figure, are
  you sure it's working" — turned out the `xl:` (1280px) visibility gate
  from the previous change meant it was `display:none` on the user's own
  ~576px-wide browser window, confirmed via computed styles on the live
  Netlify site; (2) a follow-up mid-fix: "actually I was thinking it
  climb across the screen from left to right diagonally... increasing in
  a slope form" — wanted the full-screen-diagonal version the running
  stickman gave them the taste for, not a corner-confined ladder.
  Redesigned `#ladder-climb` to span the entire viewport bottom-left to
  top-right (`position: fixed; inset: 0`, `viewBox="0 0 1000 600"`),
  rendered at every screen size — replacing the previous
  visibility-by-breakpoint approach with a **paint-order** approach for
  non-interference instead. That surfaced a real bug: the first attempt
  used `z-index: 0` reasoning that DOM order (this div placed before the
  real content) would make later content paint on top at "the same
  level" — wrong. Per the CSS2 painting-order spec, a positioned
  descendant at stack level 0 paints *after* (on top of) non-positioned
  in-flow content regardless of DOM order; only a *negative* z-index
  paints behind it. The climbing figure was visibly crossing over page
  text before this was caught. Fixed with `z-index: -1` and documented
  as a new known trap in §3, including why the "z-index:0 = same layer
  as unpositioned content" reasoning is a trap worth naming explicitly.
  Verified: 0 build errors; watched the figure climb the full diagonal
  on a 576px viewport (matching the user's actual reported width) with
  the ladder line and climbing figure correctly disappearing behind the
  hero's dashed summary box, the star doodle, and the Experience panel
  wherever they overlap, and correctly visible in the open background
  space around them — confirmed both that it's now visible and that it
  genuinely doesn't interfere with content, which was the original ask.
