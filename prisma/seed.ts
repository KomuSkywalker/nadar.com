import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminUsername = process.env.ADMIN_USERNAME || 'admin'
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'changeme', 10)

  await prisma.user.upsert({
    where: { username: adminUsername },
    update: { password: adminPassword },
    create: {
      username: adminUsername,
      password: adminPassword,
      email: `${adminUsername}@nadarkartvizit.com`,
      name: 'Admin',
      role: 'admin',
    },
  })
  console.log(`✓ Admin user: ${adminUsername}`)

  // Kerem Aydın — test / demo person
  const existingKerem = await prisma.card.findFirst({ where: { name: 'Kerem Aydın' } })
  if (!existingKerem) {
    const keremCard = await prisma.card.create({
      data: {
        name: 'Kerem Aydın',
        title: 'Gayrimenkul Danışmanı',
        company: 'RE/MAX Dia',
        bio: 'İstanbul Anadolu Yakası\'nda 12 yıllık deneyim. Konut, ticari gayrimenkul ve yatırım danışmanlığı. Güvenilir, şeffaf, sonuç odaklı çalışma prensibi.',
        phone: '+90 532 712 4589',
        whatsapp: '+905327124589',
        email: 'kerem@remaxdia.com',
        address: 'Bağdat Cad. No:142/A, Kadıköy, İstanbul',
        website: 'www.remaxdia.com',
        mapLink: 'https://maps.google.com/?q=Bağdat+Cad+Kadıköy+İstanbul',
        instagram: 'https://instagram.com/keremaydin.emlak',
        facebook: 'https://facebook.com/keremaydin.emlak',
        tiktok: 'https://tiktok.com/@keremaydin.emlak',
        portfolio: 'https://remaxdia.com/portfoy',
        photoUrl: '/images/test-kerem.webp',
        templateId: 1,
        category: 'Emlakçı',
        package: 'pro',
        status: 'active',
        canEdit: true,
        canViewStats: true,
        allowedTemplates: [1, 2, 3, 4, 5],
        views: 0,
      },
    })

    const keremPassword = await bcrypt.hash('kerem2026', 10)
    await prisma.user.create({
      data: {
        username: 'keremaydin',
        password: keremPassword,
        email: 'kerem@remaxdia.com',
        name: 'Kerem Aydın',
        role: 'customer',
        cardId: keremCard.id,
      },
    })
    console.log('✓ Test card + customer: keremaydin / kerem2026')
    console.log(`  Card URL: /card/${keremCard.id}`)
  } else {
    console.log('✓ Kerem Aydın already exists')
  }

  // Demo card (Ahmet Yılmaz)
  const existingCard = await prisma.card.findFirst({ where: { name: 'Ahmet Yılmaz' } })
  if (!existingCard) {
    const card = await prisma.card.create({
      data: {
        name: 'Ahmet Yılmaz',
        title: 'Kıdemli Emlak Danışmanı',
        company: 'RE/MAX Prestige',
        phone: '+90 532 123 45 67',
        email: 'ahmet@remax.com',
        address: 'Kadıköy, İstanbul',
        website: 'www.ahmetyilmaz.com',
        instagram: 'https://instagram.com/ahmetyilmaz',
        whatsapp: '+905321234567',
        templateId: 1,
        category: 'Emlakçı',
        package: 'pro',
        status: 'active',
        canEdit: true,
        canViewStats: true,
        allowedTemplates: [1, 2, 3, 4, 5],
        views: 47,
      },
    })

    const demoPassword = await bcrypt.hash('demo123', 10)
    await prisma.user.create({
      data: {
        username: 'ahmetyilmaz',
        password: demoPassword,
        email: 'ahmet@remax.com',
        name: 'Ahmet Yılmaz',
        role: 'customer',
        cardId: card.id,
      },
    })
    console.log('✓ Demo card + customer: ahmetyilmaz / demo123')
    console.log(`  Card URL: /card/${card.id}`)
  }

  // Demo pending order
  const existingOrder = await prisma.order.findFirst({ where: { email: 'zeynep@hukuk.com' } })
  if (!existingOrder) {
    await prisma.order.create({
      data: {
        name: 'Zeynep Arslan',
        phone: '+90 555 987 65 43',
        email: 'zeynep@hukuk.com',
        company: 'Arslan Hukuk Bürosu',
        title: 'Avukat',
        category: 'Avukat',
        package: 'premium',
        templateId: 4,
        notes: 'Elit şablon altın renklerle çok uyumlu olur.',
        status: 'pending',
      },
    })
    console.log('✓ Demo pending order: Zeynep Arslan')
  }
}

main()
  .then(() => {
    console.log('\nSeed tamamlandı!')
    return prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
