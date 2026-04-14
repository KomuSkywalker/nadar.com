import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function GET() {
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  const users = await prisma.user.findMany({
    where: { role: 'customer' },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, username: true, email: true, name: true,
      role: true, cardId: true, createdAt: true,
      card: { select: { id: true, name: true, views: true } },
    },
  })

  return NextResponse.json({ users })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  const { username, password, email, name } = await req.json()
  const hashed = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: { username, password: hashed, email, name, role: 'customer' },
  })

  return NextResponse.json({ user }, { status: 201 })
}
