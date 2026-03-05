import { CATEGORIES } from './constants.js'

const CATEGORIES_ENUM = CATEGORIES.join(', ')

const OUTPUT_SCHEMA = `{
  "post": {
    "title": "string (50-70 chars, include focus keyword)",
    "excerpt": "string (120-160 chars, compelling meta description)",
    "slug": "string (lowercase, hyphen-separated, no accents)",
    "category": "one of: ${CATEGORIES_ENUM}",
    "tags": ["string (3-5 relevant tags)"],
    "seo_config": {
      "meta_title": "string (50-70 chars)",
      "meta_description": "string (120-160 chars)",
      "focus_keyword": "string (primary keyword)",
      "secondary_keywords": ["string (2-4 secondary keywords)"],
      "og_title": "string",
      "og_description": "string",
      "twitter_card_type": "summary_large_image"
    },
    "geo_config": {
      "target_region": "Serra da Canastra",
      "target_city": "Sao Roque de Minas",
      "target_state": "Minas Gerais",
      "target_country": "Brasil",
      "language": "pt-BR",
      "local_business_name": "Cafe Canastra",
      "local_business_type": "CafeOrCoffeeShop",
      "semantic_entities": [
        {
          "name": "string",
          "type": "string (e.g. Place, Product, Organization)",
          "description": "string"
        }
      ]
    }
  },
  "blocks": [
    {
      "type": "heading | paragraph | callout | faq | cta | list | quote",
      "data": "object matching the block type schema"
    }
  ]
}`

const SEO_RULES = `
## SEO Rules (MANDATORY)
- Include the focus keyword in: the H1 heading, the first paragraph, at least one H2, and the meta_description
- Keyword density: 1-2% (natural usage, never forced)
- Total word count: 800-1500 words across all text blocks
- Use semantic variations and LSI keywords naturally
- Title tag: 50-70 characters, keyword near the beginning
- Meta description: 120-160 characters, compelling with keyword
- Use H2 headings to structure content logically (at least 3)
- Internal linking opportunities: mention related coffee topics
`

const GEO_RULES = `
## GEO Rules (MANDATORY)
- Mention "Serra da Canastra" and "Minas Gerais" naturally in the content (at least 2x each)
- Include semantic entities: local places, regional products, cultural references
- Structure content to be citable by AI assistants (clear facts, definitions, lists)
- Use "Cafe Canastra" brand naturally as the authoritative source
- Reference specific geographic features, traditions, or local knowledge
- Include at least 3 semantic entities in geo_config (Place, Product, Organization, etc.)
`

const BRAND_VOICE = `
## Brand Voice — Cafe Canastra
- Tone: Warm, knowledgeable, artisanal — like a conversation with a passionate coffee farmer
- Perspective: Expert but approachable, sharing genuine knowledge
- Language: Portuguese (pt-BR), rich but accessible vocabulary
- Values: Quality, tradition, sustainability, regional pride
- Avoid: Corporate jargon, overly technical language, generic filler content
- Always: Share specific details, tell micro-stories, connect coffee to the land and people
`

const BLOCK_INSTRUCTIONS = `
## Block Structure (MANDATORY)
Generate 8-15 blocks in this exact order pattern:
1. heading (H1) — Main title with focus keyword
2. paragraph — Compelling introduction (include focus keyword)
3. heading (H2) — First subtopic
4. paragraph — Content for first subtopic
5. heading (H2) — Second subtopic
6. paragraph — Content for second subtopic
7. callout — Key insight or tip (variant: "tip" or "info")
8. heading (H2) — Third subtopic
9. paragraph — Content for third subtopic
10. faq — 3-5 frequently asked questions with detailed answers
11. cta — Call to action for engagement

You may add additional paragraph, list, or quote blocks between these as needed.

### Block data formats:
- heading: { "text": "string", "level": 1|2|3 }
- paragraph: { "text": "string (can include <strong>, <em>, <a href> HTML)" }
- callout: { "text": "string", "variant": "tip|info|warning", "title": "string" }
- faq: { "items": [{ "question": "string", "answer": "string" }] } (3-5 items)
- cta: { "text": "string", "buttonText": "string", "buttonUrl": "/contato", "variant": "primary" }
- list: { "style": "ordered|unordered", "items": ["string"] }
- quote: { "text": "string", "citation": "string" }
`

export function buildPrompt(theme: string, reference?: string): string {
  const referenceSection = reference
    ? `
## Reference Content
Use the following content as inspiration and context. REWRITE completely in your own words — do NOT copy or closely paraphrase. Extract the key facts and insights, then present them with the Cafe Canastra brand voice:

---
${reference}
---
`
    : ''

  return `You are a content specialist for "Cafe Canastra", an artisanal coffee brand from Serra da Canastra, Minas Gerais, Brazil. Generate a complete blog post about the following theme.

## Theme
${theme}

${referenceSection}

${BRAND_VOICE}

${SEO_RULES}

${GEO_RULES}

${BLOCK_INSTRUCTIONS}

## Output Format
Respond with ONLY valid JSON matching this schema (no markdown, no code fences):
${OUTPUT_SCHEMA}

IMPORTANT:
- All text content MUST be in Portuguese (pt-BR)
- The slug must be lowercase, hyphen-separated, without accents
- Generate a unique, creative title (50-70 chars)
- The excerpt must be compelling and include the focus keyword (120-160 chars)
- Every block must have "type" and "data" fields
- FAQ answers should be detailed (2-4 sentences each)
`
}
