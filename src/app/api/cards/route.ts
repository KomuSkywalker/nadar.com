import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { getPackagePermissions } from '@/lib/permissions'
import bcrypt from 'bcryptjs'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  if (session.role === 'admin') {
    const cards = await prisma.card.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, username: true, name: true } } },
    })
    return NextResponse.json({ cards })
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId }, include: { card: true } })
  const cards = user?.card ? [user.card] : []
  return NextResponse.json({ cards })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const {
      name, title, company, bio, phone, email, address, website,
      instagram, twitter, linkedin, facebook, tiktok, youtube, whatsapp,
      photoUrl, mapLink, portfolio,
      templateId, category, package: pkg, status,
      createUser, userEmail, userName,
    } = body

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'İsim zorunludur' }, { status: 400 })
    }

    const resolvedPkg = pkg || 'starter'
    const permissions = getPackagePermissions(resolvedPkg)

    const card = await prisma.card.create({
      data: {
        name,
        title: title || null,
        company: company || null,
        bio: bio || null,
        phone: phone || null,
        email: email || null,
        address: address || null,
        website: website || null,
        instagram: instagram || null,
        twitter: twitter || null,
        linkedin: linkedin || null,
        facebook: facebook || null,
        tiktok: tiktok || null,
        youtube: youtube || null,
        whatsapp: whatsapp || null,
        photoUrl: photoUrl || null,
        mapLink: mapLink || null,
        portfolio: portfolio || null,
        templateId: Number.isFinite(Number(templateId)) && Number(templateId) >= 1 ? Number(templateId) : 1,
        category: category || null,
        package: resolvedPkg,
        status: status || 'active',
        ...permissions,
      },
    })

    let user = null
    let rawPassword = null

    if (createUser) {
      const baseUsername = (userEmail || email || name).split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
      let username = baseUsername
      let counter = 1
      while (await prisma.user.findUnique({ where: { username } })) {
        username = `${baseUsername}${counter++}`
      }

      rawPassword = Math.random().toString(36).slice(2, 10)
      const hashedPassword = await bcrypt.hash(rawPassword, 10)

      user = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          email: userEmail || email || `${username}@nadarkartvizit.com`,
          name: userName || name,
          role: 'customer',
          cardId: card.id,
        },
      })
    }

    return NextResponse.json({
      card,
      user: user ? { ...user, rawPassword } : null,
      cardUrl: `/card/${card.id}`,
    }, { status: 201 })
  } catch (error) {
    console.error('Card create error:', error)
    return NextResponse.json({ error: 'Kartvizit oluşturulamadı' }, { status: 500 })
  }
}
