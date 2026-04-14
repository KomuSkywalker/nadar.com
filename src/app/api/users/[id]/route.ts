import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const { id } = await params

  // Müşteri sadece kendi profilini güncelleyebilir
  if (session.role !== 'admin' && session.userId !== id) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }

  const body = await req.json()

  // Güvenli whitelist — raw body Prisma'ya gitmiyor
  type UpdateData = Record<string, unknown>
  const data: UpdateData = {}

  // Admin daha fazla alan güncelleyebilir
  if (session.role === 'admin') {
    if (typeof body.name     === 'string') data.name     = body.name.trim()
    if (typeof body.email    === 'string') data.email    = body.email.trim()
    if (typeof body.username === 'string') data.username = body.username.trim()
    // Admin başka bir kullanıcının rolünü yalnızca customer↔admin arasında değiştirebilir
    if (body.role === 'admin' || body.role === 'customer') data.role = body.role
  } else {
    // Müşteri yalnızca isim, e-posta ve şifresini değiştirebilir
    if (typeof body.name  === 'string') data.name  = body.name.trim()
    if (typeof body.email === 'string') data.email = body.email.trim()
  }

  if (typeof body.password === 'string' && body.password.length >= 6) {
    data.password = await bcrypt.hash(body.password, 10)
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'Güncellenecek alan yok' }, { status: 400 })
  }

  const user = await prisma.user.update({ where: { id }, data })
  const { password: _, ...safeUser } = user
  return NextResponse.json({ user: safeUser })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  const { id } = await params

  // Kendi hesabını silemez
  if (session.userId === id) {
    return NextResponse.json({ error: 'Kendi hesabınızı silemezsiniz' }, { status: 400 })
  }

  // Kullanıcıya bağlı kartı kullanıcıdan ayır (kartı silme)
  await prisma.user.update({ where: { id }, data: { cardId: null } })
  await prisma.user.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
