import {
  Type,
  Image,
  LayoutGrid,
  Quote,
  List,
  Code,
  Link,
  Minus,
  AlertCircle,
  Table,
  HelpCircle,
  MousePointer,
  Video,
  ChevronRight,
  Package,
} from 'lucide-react'
import type { BlockType } from '@/lib/types/blog'

import { HeadingEditor } from './blocks/HeadingEditor'
import { ParagraphEditor } from './blocks/ParagraphEditor'
import { ImageEditor } from './blocks/ImageEditor'
import { GalleryEditor } from './blocks/GalleryEditor'
import { QuoteEditor } from './blocks/QuoteEditor'
import { ListEditor } from './blocks/ListEditor'
import { CodeEditor } from './blocks/CodeEditor'
import { EmbedEditor } from './blocks/EmbedEditor'
import { DividerEditor } from './blocks/DividerEditor'
import { CalloutEditor } from './blocks/CalloutEditor'
import { TableEditor } from './blocks/TableEditor'
import { FaqEditor } from './blocks/FaqEditor'
import { CtaEditor } from './blocks/CtaEditor'
import { VideoEditor } from './blocks/VideoEditor'
import { AccordionEditor } from './blocks/AccordionEditor'
import { ProductEditor } from './blocks/ProductEditor'

export interface BlockRegistryEntry {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editor: React.ComponentType<any>
  icon: typeof Type
  label: string
}

export const blockRegistry: Record<BlockType, BlockRegistryEntry> = {
  heading: { editor: HeadingEditor, icon: Type, label: 'Título' },
  paragraph: { editor: ParagraphEditor, icon: Type, label: 'Parágrafo' },
  image: { editor: ImageEditor, icon: Image, label: 'Imagem' },
  gallery: { editor: GalleryEditor, icon: LayoutGrid, label: 'Galeria' },
  quote: { editor: QuoteEditor, icon: Quote, label: 'Citação' },
  list: { editor: ListEditor, icon: List, label: 'Lista' },
  code: { editor: CodeEditor, icon: Code, label: 'Código' },
  embed: { editor: EmbedEditor, icon: Link, label: 'Incorporar' },
  divider: { editor: DividerEditor, icon: Minus, label: 'Divisor' },
  callout: { editor: CalloutEditor, icon: AlertCircle, label: 'Destaque' },
  table: { editor: TableEditor, icon: Table, label: 'Tabela' },
  faq: { editor: FaqEditor, icon: HelpCircle, label: 'FAQ' },
  cta: { editor: CtaEditor, icon: MousePointer, label: 'CTA' },
  video: { editor: VideoEditor, icon: Video, label: 'Vídeo' },
  accordion: { editor: AccordionEditor, icon: ChevronRight, label: 'Acordeão' },
  product: { editor: ProductEditor, icon: Package, label: 'Produto' },
}
