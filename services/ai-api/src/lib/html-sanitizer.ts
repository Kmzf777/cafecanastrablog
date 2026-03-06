import sanitize from 'sanitize-html'

const ALLOWED_TAGS = ['strong', 'em', 'u', 'a', 'mark', 'br', 'code']
const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  a: ['href', 'target', 'rel'],
}

export function sanitizeHtml(html: string): string {
  return sanitize(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
  })
}
