// Story 2.2 / 4.2 — Renders JSON-LD schema markup

interface SchemaOrgProps {
  schema: Record<string, unknown> | Record<string, unknown>[]
}

export default function SchemaOrg({ schema }: SchemaOrgProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
