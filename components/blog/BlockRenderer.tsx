import type { ContentBlock, BlockType } from '@/lib/types/blog'
import type { BlockData } from '@/lib/types/block-data'
import { HeadingBlock } from './blocks/HeadingBlock'
import { ParagraphBlock } from './blocks/ParagraphBlock'
import { ImageBlock } from './blocks/ImageBlock'
import { GalleryBlock } from './blocks/GalleryBlock'
import { QuoteBlock } from './blocks/QuoteBlock'
import { ListBlock } from './blocks/ListBlock'
import { CodeBlock } from './blocks/CodeBlock'
import { EmbedBlock } from './blocks/EmbedBlock'
import { DividerBlock } from './blocks/DividerBlock'
import { CalloutBlock } from './blocks/CalloutBlock'
import { TableBlock } from './blocks/TableBlock'
import { FaqBlock } from './blocks/FaqBlock'
import { CtaBlock } from './blocks/CtaBlock'
import { VideoBlock } from './blocks/VideoBlock'
import { AccordionBlock } from './blocks/AccordionBlock'
import { ProductBlock } from './blocks/ProductBlock'

interface BlockRendererProps {
  blocks: ContentBlock[]
}

const widthClasses: Record<string, string> = {
  narrow: 'max-w-lg mx-auto',
  default: '',
  wide: 'max-w-4xl mx-auto',
  full: 'max-w-full',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const blockComponents: Record<BlockType, React.ComponentType<{ data: any; settings?: any }>> = {
  heading: HeadingBlock,
  paragraph: ParagraphBlock,
  image: ImageBlock,
  gallery: GalleryBlock,
  quote: QuoteBlock,
  list: ListBlock,
  code: CodeBlock,
  embed: EmbedBlock,
  divider: DividerBlock,
  callout: CalloutBlock,
  table: TableBlock,
  faq: FaqBlock,
  cta: CtaBlock,
  video: VideoBlock,
  accordion: AccordionBlock,
  product: ProductBlock,
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
  return (
    <div>
      {blocks.map((block) => {
        const Component = blockComponents[block.type]
        if (!Component) return null

        const width = block.settings?.width || 'default'
        const spacingClasses: Record<string, string> = {
          none: '',
          small: 'my-2',
          medium: 'my-4',
          large: 'my-8',
        }
        const spacing = block.settings?.spacing ? spacingClasses[block.settings.spacing] : ''

        return (
          <div
            key={block.id}
            className={`${widthClasses[width]} ${spacing} ${block.settings?.css_class || ''}`}
          >
            <Component data={block.data as BlockData} settings={block.settings} />
          </div>
        )
      })}
    </div>
  )
}
