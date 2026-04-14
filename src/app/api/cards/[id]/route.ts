import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const { id } = await params
  const card = await prisma.card.findUnique({ where: { id } })
  if (!card) return NextResponse.json({ error: 'Kartvizit bulunamadı' }, { status: 404 })

  // Müşteri sadece kendi kartını görebilir
  if (session.role === 'customer') {
    const user = await prisma.user.findUnique({ where: { id: session.userId } })
    if (user?.cardId !== id) {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
    }
  }

  return NextResponse.json({ card })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const { id } = await params

  if (session.role === 'customer') {
    const user = await prisma.user.findUnique({ where: { id: session.userId } })
    if (user?.cardId !== id) {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
    }
  }

  const body = await req.json()

  // Sadece güncellenebilir alanlar — Prisma'ya ham body gönderilmez
  type UpdateData = Record<string, unknown>
  const data: UpdateData = {}

  const textFields = [
    'name', 'title', 'company', 'bio', 'phone', 'email', 'address',
    'website', 'instagram', 'twitter', 'linkedin', 'facebook', 'tiktok',
    'youtube', 'whatsapp', 'photoUrl', 'logoUrl', 'mapLink', 'portfolio',
    'category', 'status',
  ]
  for (const f of textFields) {
    if (f in body) data[f] = body[f] === '' ? null : body[f]
  }

  if ('templateId' in body) data.templateId = Number(body.templateId) || 1
  if ('package'    in body) data.package    = body.package ?? null
  if ('canEdit'      in body) data.canEdit      = Boolean(body.canEdit)
  if ('canViewStats' in body) data.canViewStats = Boolean(body.canViewStats)
  if ('allowedTemplates' in body && Array.isArray(body.allowedTemplates)) {
    data.allowedTemplates = body.allowedTemplates.map(Number)
  }

  const card = await prisma.card.update({ where: { id }, data })
  return NextResponse.json({ card })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  const { id } = await params

  await prisma.analytics.deleteMany({ where: { cardId: id } })
  await prisma.user.updateMany({ where: { cardId: id }, data: { cardId: null } })
  await prisma.order.updateMany({ where: { cardId: id }, data: { cardId: null } })
  await prisma.card.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
