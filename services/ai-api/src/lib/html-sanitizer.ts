import DOMPurify from 'isomorphic-dompurify'

const ALLOWED_TAGS = ['strong', 'em', 'u', 'a', 'mark', 'br', 'code']
const ALLOWED_ATTR = ['href', 'target', 'rel']

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
  })
}
