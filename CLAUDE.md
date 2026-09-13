# Portfolio — Project Requirements & Style Guide

This file is the source of truth for this project's goals, design direction, and
code conventions. Update it whenever a decision changes so it stays accurate —
don't let it drift from what the code actually does.

## 1. Purpose

A personal portfolio site for **Yong Xing Fu**, targeting **fintech** roles:
Software Engineer, Data Analyst, Business Analyst. Primary audience is
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

**Inspiration:** [tiagofragoso.com](https://tiagofragoso.com/#links) — liked
the *structure* (content organized into distinct illustrated "panels"/sections)
and the hand-crafted, personal feel. We are **not** copying its literal visual
style (hand-drawn illustration, paper texture, Portuguese copywriter branding).
Instead we translate the panel-based structure into something more technical.

**Chosen palette: "Dark Tech Sleek"**
- Background: `ink-950 #0D0F12`, panels `ink-900 #13161B` / `ink-800 #1B1F26`
- Text: `paper-100 #E8E8E6` (primary), `paper-400 #9AA0A6` (secondary)
- Accents: `accent-teal #5EEAD4`, `accent-indigo #818CF8` — used sparingly for
  links, highlights, tags, glow effects. Never as large background fills.
- Subtle radial gradient glow behind the page (`bg-grid-glow` utility), glass
  panels (`.panel` — bordered, low-opacity fill, backdrop blur).

**Typography**
- Headings: `Space Grotesk` (slightly technical/geometric)
- Body: `IBM Plex Sans`
- Labels/tags/dates/meta: `IBM Plex Mono` — monospace is used deliberately as
  a recurring "technical" signal throughout (section labels, tag pills, dates).

**Motion**
- Restrained, purposeful animation only: fade/slide-up on hero load, panel
  reveal on scroll (to be added via a small IntersectionObserver script — not
  yet wired up as of initial scaffold).
- All custom animations must respect `prefers-reduced-motion` (see
  `global.css` — already handled globally, don't bypass it per-component).
- No parallax, no heavy WebGL/canvas work — keep it lightweight per the
  "lightning-fast" requirement even while adding animation and color.

**Overall vibe:** technical but warm — not a sterile SaaS template, not a
literal illustrated portfolio. A bit of color and motion, still fast and
readable, still fintech-credible (i.e. not too playful/startup-y).

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
  `.panel`, `.tag-pill`, `.section-label`, `.link-underline`) rather than
  copy-pasted across files.
- **Colors:** always reference the semantic Tailwind tokens (`ink-950`,
  `paper-400`, `accent-teal`, etc.) defined in `tailwind.config.mjs` — never
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
- [ ] Add scroll-reveal IntersectionObserver script for `.reveal` elements
      (classes are already present on `Experience`/`ProjectCard`, behavior
      not yet wired).
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
