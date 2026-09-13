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

**Palette — "Comic Paper"**
- Paper (background/panels): `paper-50 #FFFDF8` (page bg), `paper-100
  #FFF8EA` (panel bg), `paper-200 #F4E9D0` (border tint)
- Ink (text/borders/shadows): `ink-900 #161311` (primary text, all borders,
  hard shadows), `ink-700 #4A4038` (secondary text), `ink-400 #8A7F72`
  (meta/tertiary text)
- Splash accents (used sparingly — badges, underlines, stars, tag rotation
  — never as large fills): `splash-red #F0483E`, `splash-blue #3A86C8`,
  `splash-yellow #F6BE3B`
- Page background carries a subtle halftone dot grid (`radial-gradient`,
  no image asset) for the paper/print-comic texture.

**Typography**
- Display/headings: `Permanent Marker` — big, bold, comic marker lettering
- Hand accents (subheads, role labels, footer line): `Caveat` — handwritten
- Body copy: `Inter` — kept clean/readable despite the playful chrome, since
  recruiters still need to scan real content fast
- Meta/dates/tags: `Space Mono`

**The comic panel system (this is the core visual language — reuse it,
don't invent new card styles):**
- `.panel` (`global.css`) — paper card, 3px ink border, hard offset shadow
  (`shadow-comic`, no blur — flat comic-ink shadow), independent slight
  rotation per position (alternating via `nth-of-type`) for a hand-placed
  feel. On hover: straightens, lifts, shadow grows. Also mouse-reactive: a
  site-wide script in `BaseLayout.astro` applies a subtle 3D tilt following
  the cursor within each `.panel`.
- `.tag-pill` — sticker badge, ink border, hard shadow, rotates through the
  three splash colors via `nth-of-type` so a group reads as hand-applied
  stickers, not a uniform grid.
- `.comic-btn` — CTA button with a hard shadow that visually "presses in"
  on `:active` (shadow disappears, button shifts down-right).
- `.section-label` — rounded sticker tag (yellow, slightly rotated) used
  as the eyebrow label above every section heading.
- `.doodle-underline` — hand-drawn wavy SVG stroke under the hero name,
  animates in (stroke-dashoffset draw-on) when revealed on scroll.
- Hand-drawn SVG doodles (star burst, scribble arrow) as ornamental
  accents in the hero — `aria-hidden`, purely decorative.

**Motion — the site should feel reactive, not static:**
- Scroll-reveal on every `.reveal` element (fade + slide + slight scale),
  staggered per sibling, via the `IntersectionObserver` script in
  `BaseLayout.astro`.
- Custom trailing cursor dot (`#cursor-dot`) that lerps toward the pointer
  each frame and grows/tints over interactive elements — desktop only.
- Mouse-reactive tilt on every `.panel` (see above).
- `.comic-btn` / `.tag-pill` hover-lift + press-down `:active` states.
- All of the above is **gated behind `hover: hover` and `pointer: fine`
  media queries** (skipped on touch) and **fully disabled under
  `prefers-reduced-motion: reduce`** (see the guards at the bottom of
  `global.css` and the top of the mouse-effects script) — reactive chrome
  must never become the only way to perceive content, and must never run
  where it'd just drain a phone battery for no visual benefit.
- No-JS fallback: if the reveal script fails to load, `.reveal` content
  stays fully visible (CSS rule keyed off a `.js-reveal-ready` class added
  synchronously in `<head>`) rather than staying hidden forever.

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
