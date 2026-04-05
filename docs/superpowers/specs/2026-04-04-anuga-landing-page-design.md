# ANUGA Landing Page — Design Spec

## Overview

Landing page at `/anuga` for the Café Canastra ANUGA Brasil 2026 event. Visitors scan a QR code on a drip coffee sample and land on this page. The goal is to capture leads (name, WhatsApp, email, segment) and direct them to the sales consultant João via WhatsApp.

**URL:** `https://www.cafecanastra.com/anuga`

## Architecture

- **Route:** `app/anuga/page.tsx` (Next.js App Router)
- **Components:** Self-contained in `components/anuga/` — exclusive design, not shared with home
- **Animation:** `components/ui/text-effect.tsx` (framer-motion TextEffect component)
- **Backend:** Two webhook POSTs on form submission (no Supabase for this page)
- **No expiration logic** — page stays up until manually removed

## Design System (Exclusive to /anuga)

### Color Palette
- **Primary Dark:** `#2C1810` (rich brown)
- **Secondary Dark:** `#4A2C1A` (warm brown)
- **Accent Gold:** `#8B6914` (rustic gold)
- **Background Cream:** `#F5EDE4` (warm off-white)
- **Text Light:** `#F5E6D0` (cream for dark backgrounds)

### Typography
- **Headings:** Georgia, serif (premium, editorial feel)
- **Body:** System sans-serif stack (clean, readable)

### Visual Style
- Rustic-sophisticated: subtle textures, earthy palette, generous spacing
- Mobile-first, lightweight (no heavy assets)
- Decorative photos from `/public` between sections (colheita-manual, torra-artesanal, degustacao, etc.)

## Tela 1 — Animação de Entrada

### Behavior
- Fullscreen, centered, solid gradient background (`#2C1810` → `#4A2C1A` → `#8B6914`)
- Duration: 3-4 seconds total
- "Pular" button (skip) in bottom-right, always visible
- After animation completes OR skip clicked → fade transition to Tela 2

### Copy (sequential, char-by-char with blur effect)
1. **Headline** (delay 0s): "Esse café aumenta a margem do seu negócio."
2. **Subheadline** (delay 1.2s): "Direto do produtor rural, na Serra da Canastra."
3. **Complement** (delay 2.4s): "Mais qualidade. Mais consistência. Mais lucro por xícara."

### Animation Tech
- `TextEffect` component with `per="char"` and `preset="blur"`
- Each line uses a sequential `delay` prop
- `onAnimationComplete` on the last line triggers auto-advance after 0.5s pause

## Tela 2 — Página Principal

### Section 1: Hero Banner
- Dark background (`#2C1810` → `#3D2215`)
- Café Canastra logo (`/logo-canastra.png`) centered
- **Headline:** "Ganhe 20% de bonificação na sua primeira compra"
- **Badge:** "Exclusivo visitantes ANUGA"

### Section 2: Value Block
- Cream background (`#F5EDE4`)
- **Title:** "Por que esse café aumenta sua margem?"
- **Bullets** with gold accent markers (✦):
  - Compra direta do produtor (sem intermediários)
  - Padronização de qualidade
  - Melhor custo-benefício por xícara
- Optional: decorative photo strip (colheita-manual, torra-artesanal)

### Section 3: Form
- Same cream background, card-style container
- **Title:** "Receba seu cupom agora"

#### Fields (all required):
| Field | Type | Validation |
|-------|------|------------|
| Nome | text input | required, min 2 chars |
| WhatsApp | tel input with BR mask `(DD) 99999-9999` | required, valid BR phone |
| E-mail | email input | required, valid email |
| Compra café para | select dropdown | required |

#### Select Options:
- Cafeteria
- Revenda
- Consumo próprio
- Exportação 🌍

#### Export Behavior:
When "Exportação" is selected, all form labels become bilingual (PT-BR / EN side by side). The following message appears below the select:

> "We work with export-ready specialty coffees. Our team can assist you internationally."

#### Submit Button:
- Text: "Quero receber meu benefício"
- Background: `#8B6914` (accent gold)
- Full width on mobile

#### Below Form:
- Helper text: "Seu cupom será enviado por WhatsApp e e-mail. Verifique se os dados estão corretos."

### Form Submission

**On submit:**
1. Validate all fields client-side
2. Show loading state on button
3. POST JSON to BOTH webhooks in parallel:
   - `https://webhook.canastrainteligencia.com/webhook/anuga`
   - `https://n8n.canastrainteligencia.com/webhook-test/anuga`
4. Payload:
   ```json
   {
     "nome": "string",
     "whatsapp": "string (raw digits with country code)",
     "email": "string",
     "segmento": "cafeteria | revenda | consumo_proprio | exportacao",
     "origem": "anuga_2026",
     "timestamp": "ISO 8601"
   }
   ```
5. On success (any 2xx from either webhook) → transition to Tela 3
6. On error → show inline error message, allow retry

## Tela 3 — Tela de Sucesso

### Behavior
- Replaces entire page content (not modal, not scroll)
- Animated entrance (fade in)

### Layout
- Fullscreen dark background (`#2C1810`)
- Centered content

### Content
1. **Checkmark icon** (animated)
2. **Headline:** "Seu cupom de 20% foi liberado!"
3. **Subtext:** "Enviamos no seu WhatsApp e e-mail."
4. **Divider**
5. **CTA Section:**
   - **Title:** "Quer ajuda para escolher seu café agora?"
   - **Subtitle:** "Fale com nosso consultor e descubra o melhor café para o seu negócio"
   - **WhatsApp Button** (green `#25D366`): "Quero escolher meu café"
   - **Link:** `https://wa.me/5534993195252?text=Olá%20João,%20acabei%20de%20me%20cadastrar%20na%20ANUGA%20e%20quero%20entender%20melhor%20os%20cafés.`

## File Structure

```
app/anuga/
  page.tsx              # Server component with metadata/SEO
  AnugaClient.tsx       # Client component orchestrating the 3 screens

components/anuga/
  IntroAnimation.tsx    # Tela 1 — fullscreen animation
  MainContent.tsx       # Tela 2 — hero + value + form
  AnugaForm.tsx         # Form with validation and webhook submission
  SuccessScreen.tsx     # Tela 3 — post-registration
  
components/ui/
  text-effect.tsx       # TextEffect animation component (from promptanimacao.md)
```

## SEO / Metadata

```typescript
{
  title: "Café Canastra | ANUGA 2026 — Oferta Exclusiva",
  description: "Ganhe 20% de bonificação na sua primeira compra. Café especial direto do produtor na Serra da Canastra.",
  robots: "noindex, nofollow"  // landing page, not for search engines
}
```

## Performance

- No heavy images on Tela 1 (pure CSS gradient + text animation)
- Images lazy-loaded on Tela 2
- framer-motion tree-shaken (already in project)
- No external fonts (Georgia + system stack)

## Dependencies

- `framer-motion` — already installed
- No new dependencies required
