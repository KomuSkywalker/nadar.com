import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const { id } = await params

  if (session.role === 'customer') {
    const user = await prisma.user.findUnique({ where: { id: session.userId } })
    if (user?.cardId !== id) {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
    }
  }

  const card = await prisma.card.findUnique({ where: { id }, select: { views: true, clicks: true } })
  if (!card) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  const recentViews = await prisma.analytics.count({
    where: {
      cardId: id,
      eventType: 'view',
      createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    },
  })

  return NextResponse.json({ views: card.views, recentViews, clicks: card.clicks })
}
