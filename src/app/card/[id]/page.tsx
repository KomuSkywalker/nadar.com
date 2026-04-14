// Her ziyarette view sayısı artması gerektiğinden cache kapatılıyor
export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import CardTemplate from '@/components/card/CardTemplate'
import { headers } from 'next/headers'

interface Props {
  params: Promise<{ id: string }>
}

async function incrementViews(id: string, req: { ip: string; ua: string; referrer: string }) {
  try {
    await prisma.card.update({ where: { id }, data: { views: { increment: 1 } } })
    await prisma.analytics.create({
      data: {
        cardId: id,
        eventType: 'view',
        ipAddress: req.ip,
        userAgent: req.ua,
        referrer: req.referrer,
      },
    })
  } catch (err) {
    console.error('Analytics kaydedilemedi:', err)
  }
}

export default async function CardPage({ params }: Props) {
  const { id } = await params

  const card = await prisma.card.findUnique({ where: { id } })
  if (!card || card.status !== 'active') {
    notFound()
  }

  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for') || 'unknown'
  const ua = headersList.get('user-agent') || ''
  const referrer = headersList.get('referer') || ''

  await incrementViews(id, { ip, ua, referrer })

  return (
    <div className="min-h-screen">
      <CardTemplate card={card} />
    </div>
  )
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const card = await prisma.card.findUnique({ where: { id } })

  if (!card) return { title: 'Kartvizit bulunamadı' }

  return {
    title: `${card.name}${card.title ? ` — ${card.title}` : ''} | Nadar Kartvizit`,
    description: `${card.name}${card.company ? `, ${card.company}` : ''}. ${card.phone || ''} ${card.email || ''}`.trim(),
  }
}
