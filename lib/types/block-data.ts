// Story 1.1 — Block data interfaces for all 16 block types

export interface HeadingData {
  text: string
  level: 1 | 2 | 3 | 4 | 5 | 6
  anchor?: string
}

export interface ParagraphData {
  text: string
}

export interface ImageData {
  src: string
  alt: string
  caption?: string
  width?: number
  height?: number
}

export interface GalleryData {
  images: Array<{
    src: string
    alt: string
    caption?: string
  }>
  columns?: 2 | 3 | 4
  layout?: 'grid' | 'masonry' | 'carousel'
}

export interface QuoteData {
  text: string
  citation?: string
  url?: string
}

export interface ListData {
  style: 'ordered' | 'unordered'
  items: string[]
}

export interface CodeData {
  code: string
  language?: string
  filename?: string
  showLineNumbers?: boolean
}

export interface EmbedData {
  url: string
  provider?: string
  html?: string
  caption?: string
}

export interface DividerData {
  style?: 'solid' | 'dashed' | 'dotted' | 'ornamental'
}

export interface CalloutData {
  text: string
  variant?: 'info' | 'warning' | 'success' | 'error' | 'tip'
  title?: string
  icon?: string
}

export interface TableData {
  headers: string[]
  rows: string[][]
  caption?: string
}

export interface FaqData {
  items: Array<{
    question: string
    answer: string
  }>
}

export interface CtaData {
  text: string
  buttonText: string
  buttonUrl: string
  variant?: 'primary' | 'secondary' | 'outline'
  description?: string
}

export interface VideoData {
  url: string
  provider?: 'youtube' | 'vimeo' | 'custom'
  title?: string
  thumbnail?: string
}

export interface AccordionData {
  items: Array<{
    title: string
    content: string
    defaultOpen?: boolean
  }>
}

export interface ProductData {
  name: string
  description?: string
  price?: string
  currency?: string
  image?: string
  url?: string
  rating?: number
  features?: string[]
}

// Discriminated union map for type-safe block data access
export type BlockDataMap = {
  heading: HeadingData
  paragraph: ParagraphData
  image: ImageData
  gallery: GalleryData
  quote: QuoteData
  list: ListData
  code: CodeData
  embed: EmbedData
  divider: DividerData
  callout: CalloutData
  table: TableData
  faq: FaqData
  cta: CtaData
  video: VideoData
  accordion: AccordionData
  product: ProductData
}

// Union of all block data types
export type BlockData =
  | HeadingData
  | ParagraphData
  | ImageData
  | GalleryData
  | QuoteData
  | ListData
  | CodeData
  | EmbedData
  | DividerData
  | CalloutData
  | TableData
  | FaqData
  | CtaData
  | VideoData
  | AccordionData
  | ProductData
