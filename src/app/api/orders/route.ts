import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { card: { select: { id: true, name: true } } },
  })

  return NextResponse.json({ orders })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, phone, email, company, title, category, package: pkg, templateId, notes } = body

    if (!name || !phone || !email || !category || !pkg) {
      return NextResponse.json({ error: 'Zorunlu alanlar eksik' }, { status: 400 })
    }

    const order = await prisma.order.create({
      data: {
        name,
        phone,
        email,
        company,
        title,
        category,
        package: pkg,
        templateId: templateId ? Number(templateId) : 1,
        notes,
      },
    })

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    console.error('Order create error:', error)
    return NextResponse.json({ error: 'Sipariş oluşturulamadı' }, { status: 500 })
  }
}
