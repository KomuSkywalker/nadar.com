import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { getPackagePermissions } from '@/lib/permissions'
import bcrypt from 'bcryptjs'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  const { id } = await params
  const order = await prisma.order.findUnique({ where: { id }, include: { card: true } })
  if (!order) return NextResponse.json({ error: 'Sipariş bulunamadı' }, { status: 404 })

  return NextResponse.json({ order })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()

  // If completing the order, create card + user automatically
  if (body.status === 'done' && body.createCard) {
    const order = await prisma.order.findUnique({ where: { id } })
    if (!order) return NextResponse.json({ error: 'Sipariş bulunamadı' }, { status: 404 })

    // Create card
    const resolvedPkg = order.package || 'starter'
    const permissions = getPackagePermissions(resolvedPkg)

    const card = await prisma.card.create({
      data: {
        templateId: order.templateId || 1,
        category: order.category || '',
        package: resolvedPkg,
        name: order.name,
        title: order.title || '',
        company: order.company || '',
        phone: order.phone,
        email: order.email,
        status: 'active',
        ...permissions,
      },
    })

    // Generate username from email
    const baseUsername = order.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '')
    let username = baseUsername
    let counter = 1
    while (await prisma.user.findUnique({ where: { username } })) {
      username = `${baseUsername}${counter++}`
    }

    const rawPassword = Math.random().toString(36).slice(2, 10)
    const hashedPassword = await bcrypt.hash(rawPassword, 10)

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email: order.email,
        name: order.name,
        role: 'customer',
        cardId: card.id,
      },
    })

    await prisma.order.update({
      where: { id },
      data: { status: 'done', cardId: card.id },
    })

    return NextResponse.json({
      success: true,
      card,
      user: { ...user, rawPassword },
      cardUrl: `/card/${card.id}`,
    })
  }

  const order = await prisma.order.update({
    where: { id },
    data: { status: body.status },
  })

  return NextResponse.json({ order })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  const { id } = await params
  await prisma.order.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
