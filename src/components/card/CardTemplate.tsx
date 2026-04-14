import type { CardData } from '@/components/templates/types'
import TemplateBasic from '@/components/templates/TemplateBasic'
import TemplateArt from '@/components/templates/TemplateArt'
import TemplateAbsurd from '@/components/templates/TemplateAbsurd'
import TemplateElit from '@/components/templates/TemplateElit'
import TemplateFelix from '@/components/templates/TemplateFelix'

export type { CardData }

const TEMPLATES: Record<number, React.ComponentType<{ card: CardData }>> = {
  1: TemplateBasic,
  2: TemplateArt,
  3: TemplateAbsurd,
  4: TemplateElit,
  5: TemplateFelix,
}

export default function CardTemplate({ card }: { card: CardData }) {
  const Template = TEMPLATES[card.templateId] ?? TemplateBasic
  return <Template card={card} />
}
