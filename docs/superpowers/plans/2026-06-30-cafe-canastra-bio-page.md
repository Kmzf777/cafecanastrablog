# Café Canastra `/bio` Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> **FRONTEND CONSTRAINT:** Any agent touching frontend code in this plan MUST use the `frontend-design` skill and shadcn/ui components.

**Goal:** Build a standalone, warm-rustic-premium link-in-bio page at `/bio` for Café Canastra's Instagram, routing leads to store, wholesale, private-label, and secondary brand links.

**Architecture:** `app/bio/page.tsx` is a server component owning SEO/OG metadata and rendering a client `BioClient.tsx` that holds all animation and interactive UI. Standalone layout (no global site header/footer). shadcn `Button` is the base primitive, restyled into branded link cards. framer-motion drives polished entrance/hover motion, gated by `prefers-reduced-motion`.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind 3 (existing `coffee`/`gold`/`earth` palette), shadcn/ui, framer-motion, lucide-react, next/image.

**Verification model:** No unit-test runner exists in this repo. Each task is verified with `npm run build` (type + route correctness) and manual visual review at 375px and desktop widths. Reference spec: `docs/superpowers/specs/2026-06-30-cafe-canastra-bio-page-design.md`.

---

## File Structure

| File | Responsibility |
|------|----------------|
| `app/bio/page.tsx` | Server component. `metadata` export (title, description, OG/Twitter). Renders `<BioClient />`. |
| `app/bio/BioClient.tsx` | `"use client"`. Background layer + `BioHeader`, `BioLinkButton`, `BioSecondaryLinks`, `BioFooter` (local components) + framer-motion orchestration + reduced-motion handling. |

Existing reused files (do not restructure): `components/ui/button.tsx`, `lib/utils.ts` (`cn`), `tailwind.config.ts` palette, `/public/logo-canastra.png`, `/public/banner-cafecanastra.png`.

---

## Task 1: Page route + metadata + client skeleton

**Files:**
- Create: `app/bio/page.tsx`
- Create: `app/bio/BioClient.tsx`

- [ ] **Step 1: Create the client skeleton**

Use the `frontend-design` skill before writing. Create `app/bio/BioClient.tsx`:

```tsx
"use client"

export default function BioClient() {
  return (
    <main className="min-h-[100dvh] w-full bg-coffee-50 text-coffee-900">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col items-center justify-center px-5 py-10">
        <p className="font-serif text-2xl">Café Canastra</p>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Create the server page with metadata**

Create `app/bio/page.tsx`:

```tsx
import type { Metadata } from "next"
import BioClient from "./BioClient"

export const metadata: Metadata = {
  title: "Café Canastra — Links",
  description:
    "Cafés especiais da Serra da Canastra. Loja online, atacado, própria marca e mais.",
  openGraph: {
    title: "Café Canastra — Links",
    description:
      "Cafés especiais da Serra da Canastra. Loja online, atacado, própria marca e mais.",
    images: [{ url: "/banner-cafecanastra.png" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Café Canastra — Links",
    description: "Cafés especiais da Serra da Canastra.",
    images: ["/banner-cafecanastra.png"],
  },
}

export default function BioPage() {
  return <BioClient />
}
```

- [ ] **Step 3: Verify build + route**

Run: `npm run build`
Expected: build succeeds, route `/bio` appears in the route list, no type errors.

- [ ] **Step 4: Commit**

```bash
git add app/bio/page.tsx app/bio/BioClient.tsx
git commit -m "feat: scaffold /bio link-in-bio route with metadata"
```

---

## Task 2: Full branded UI + animations

**Files:**
- Modify: `app/bio/BioClient.tsx` (replace skeleton with full implementation)

- [ ] **Step 1: Implement the full page**

Use the `frontend-design` skill and shadcn `Button` (`@/components/ui/button`). Build, in `app/bio/BioClient.tsx`, the warm-rustic-premium layout described in the spec:

Requirements (all MUST be present):
- **Background layer:** cream→soft-coffee vertical gradient (`coffee`/`earth` palette), subtle grain/noise texture overlay, 2–3 slowly drifting coffee-bean/leaf accent shapes (absolutely positioned, low opacity, behind content).
- **`BioHeader`:** circular `/logo-canastra.png` via `next/image` (explicit width/height, ~96px) with a soft `gold` ring and gentle float animation; "Café Canastra" in `font-serif`; tagline "Cafés especiais da Serra da Canastra"; badge row "Fazenda própria · Micro-torrefação · Minas Gerais".
- **`BioLinkButton`** (reusable local component wrapping shadcn `Button` with `asChild` + `<a>`): full-width, large tap target (min-h ~56px), left lucide icon, label, right `ChevronRight`; warm filled style; hover = lift (`-translate-y`) + `gold` glow shadow + chevron slides right. Render three, in order:
  1. `ShoppingBag` "Loja Online" → `https://loja.cafecanastra.com`
  2. `Package` "Comprar no Atacado" → `https://atacado.cafecanastra.com/cafeatacado`
  3. `Tag` "Monte sua Própria Marca" → `https://atacado.cafecanastra.com/terceirizacaocafe`
  All external: `target="_blank"`, `rel="noopener noreferrer"`.
- **Divider** with centered label "conheça mais".
- **`BioSecondaryLinks`:** compact row of 3 outline/ghost links with icon+label: `Globe` "Site" → `https://cafecanastra.com` (new tab); `BookOpen` "Blog" → `/blog` (internal, same tab, use `next/link`); `Landmark` "História" → `/historia` (internal, same tab, `next/link`).
- **`BioFooter`:** `@cafecanastra` linking to `https://www.instagram.com/cafecanastra` (new tab) + `© Café Canastra {new Date().getFullYear()}`.
- **Motion (framer-motion):** container with staggered children, each block fades + slides up on mount; logo gentle infinite float. Read `useReducedMotion()` and disable/zero-out entrance + float when true.
- All interactive elements have `focus-visible` styles and accessible names (`aria-label` on icon-only affordances).

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: build succeeds, no type errors, `/bio` still listed.

- [ ] **Step 3: Manual visual review**

Run: `npm run dev`, open `http://localhost:3000/bio`.
Confirm: standalone (no site chrome); all 6 links point to correct URLs with correct targets; entrance + hover animations play; logo floats; looks good at 375px and desktop; toggle OS reduced-motion → animations are disabled.

- [ ] **Step 4: Commit**

```bash
git add app/bio/BioClient.tsx
git commit -m "feat: build warm-rustic /bio link-in-bio UI with animations"
```

---

## Task 3: Accessibility + reduced-motion + contrast polish

**Files:**
- Modify: `app/bio/BioClient.tsx`

- [ ] **Step 1: Verify and fix accessibility/contrast**

Using the `frontend-design` skill, confirm and fix as needed:
- Primary button text meets contrast against its fill (adjust `coffee`/`gold` shades if borderline).
- Every link has a clear accessible name; icon-only elements have `aria-label`.
- `focus-visible` ring visible on all interactive elements against the warm bg.
- `prefers-reduced-motion`: entrance animations and logo float are fully disabled (not just shortened).

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: build succeeds, no type errors.

- [ ] **Step 3: Final manual review**

Re-open `/bio`; tab through with keyboard (focus rings visible, logical order); re-check reduced-motion; confirm OG preview metadata present in page `<head>`.

- [ ] **Step 4: Commit**

```bash
git add app/bio/BioClient.tsx
git commit -m "feat: a11y, contrast, and reduced-motion polish for /bio"
```

---

## Self-Review Notes

- **Spec coverage:** route+metadata (T1), background/header/primary/secondary/footer/motion (T2), a11y/contrast/reduced-motion (T3) — all spec sections mapped.
- **Type consistency:** component names (`BioHeader`, `BioLinkButton`, `BioSecondaryLinks`, `BioFooter`) consistent across tasks; link URLs match spec table exactly.
- **No placeholders:** concrete URLs, icons, file paths, and commands throughout.
