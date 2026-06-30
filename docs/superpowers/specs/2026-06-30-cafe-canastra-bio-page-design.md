# Café Canastra — `/bio` Link-in-Bio Page — Design Spec

**Date:** 2026-06-30
**Status:** Approved
**Author:** Brainstorming session (Claude Code)

## Purpose

A standalone, beautifully decorated link-in-bio page at `/bio` to be used in the
Café Canastra Instagram bio (`@cafecanastra`, ~9k+ followers). It captures leads
arriving from Instagram and routes them to the right destination: retail store,
wholesale (atacado), and private-label (própria marca), plus secondary links to
the main site, blog, and brand history.

Opened almost exclusively on mobile → mobile-first.

## Brand Context

- Specialty coffee farm + micro-roastery in Serra da Canastra (MG).
- Product lines: Suave, Clássico, Canela.
- Existing palette (in `tailwind.config.ts`): `coffee`, `gold`, `earth` scales.
- Assets in `/public`: `logo-canastra.png`, `banner-cafecanastra.png`, product images.
- Site is Next.js 16 (App Router), React 19, Tailwind 3, shadcn/ui, framer-motion,
  lucide-react.

## Visual Direction

**Warm & rustic premium.**

- Background: cream → soft coffee vertical gradient, subtle grain/noise texture,
  a couple of slow-drifting coffee-bean/leaf accents using `coffee`/`gold`/`earth`.
- Serif headings (`font-serif`), warm coffee-toned body text.
- Premium, artisanal, cozy feel consistent with the existing brand.

## Motion

**Polished & lively** (framer-motion):

- Staggered fade-up entrance on load.
- Buttons: hover lift + gold glow, chevron slides right on hover.
- Logo: gentle float.
- Background: subtle slow drift on accents.
- MUST respect `prefers-reduced-motion` (disable/severely reduce motion).

## Architecture

- `app/bio/page.tsx` — server component. Owns SEO + Open Graph / Twitter metadata
  (title, description, OG image using `banner-cafecanastra.png` or logo) so the
  link previews nicely when shared. Renders `<BioClient />`.
- `app/bio/BioClient.tsx` — client component (`"use client"`). All animation and
  interactive UI. No global site header/footer; full-screen standalone layout.
- Reuse shadcn `Button` (`components/ui/button.tsx`) as the base primitive,
  restyled into branded link cards. Reuse `lib/utils` `cn`.
- Centered column, ~`max-w-md`, generous vertical rhythm, large tap targets.

### Components within BioClient

| Unit | Responsibility |
|------|----------------|
| `BioHeader` | Circular logo (gold ring, float), brand name (serif), tagline, badge row |
| `BioLinkButton` | One full-width primary link card: icon + label + chevron, hover glow/lift |
| `BioSecondaryLinks` | Compact row: Site / Blog / História |
| `BioFooter` | `@cafecanastra` handle + copyright |
| Background layer | Gradient + grain + floating accents |

These can live in one `BioClient.tsx` file (page is small) but each should be a
clearly-named local component.

## Content / Links

**Header**
- Logo: `/logo-canastra.png`
- Name: "Café Canastra"
- Tagline: "Cafés especiais da Serra da Canastra"
- Badges: "Fazenda própria · Micro-torrefação · Minas Gerais"

**Primary buttons** (full-width, in this order):

| Order | Label | Icon | URL | Target |
|-------|-------|------|-----|--------|
| 1 | Loja Online | Coffee/ShoppingBag | `https://loja.cafecanastra.com` | new tab |
| 2 | Comprar no Atacado | Package | `https://atacado.cafecanastra.com/cafeatacado` | new tab |
| 3 | Monte sua Própria Marca | Tag | `https://atacado.cafecanastra.com/terceirizacaocafe` | new tab |

**Secondary row** (smaller, outline/ghost):

| Label | Icon | URL | Target |
|-------|------|-----|--------|
| Site | Globe | `https://cafecanastra.com` | new tab |
| Blog | BookOpen | `/blog` | same tab (internal) |
| História | Landmark | `/historia` | same tab (internal) |

Divider label between primary and secondary: "conheça mais".

**Footer**
- `@cafecanastra` (links to `https://www.instagram.com/cafecanastra`, new tab)
- `© Café Canastra <current year>`

## Decisions / Out of Scope (YAGNI)

- All external links open in a new tab (`target="_blank"` + `rel="noopener noreferrer"`).
- NO WhatsApp button.
- NO individual Suave/Clássico/Canela buttons (Loja Online covers products).
- Secondary links are a compact icon row, not three large buttons.
- No analytics-specific event wiring beyond the existing global GA/GTM already in
  the app layout (page is auto-tracked).
- No CMS/dynamic content — links are static in code.

## Error Handling

- Static links; minimal runtime failure surface.
- Use `next/image` for the logo with explicit width/height to avoid layout shift.
- Reduced-motion fallback prevents motion-sickness / accessibility issues.

## Accessibility

- Each link: descriptive accessible name, `aria-label` where the icon alone is shown.
- Sufficient color contrast against the warm background (verify primary buttons).
- Focus-visible states on all interactive elements.
- Respect `prefers-reduced-motion`.

## Testing / Verification

- `npm run build` succeeds (no type/route errors).
- Manual: page renders standalone (no site chrome), all links point to correct URLs
  with correct targets, animations play and degrade with reduced motion, looks good
  at 375px width (mobile) and on desktop.

## Implementation Constraint

Any agent that touches the frontend MUST use the `frontend-design` skill and
shadcn/ui components.
