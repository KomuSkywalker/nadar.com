'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminSidebar from '@/components/layout/AdminSidebar'

interface Stats {
  totalCards: number
  pendingOrders: number
  totalViews: number
  newCustomers: number
}

interface AdminUser {
  name: string
  username: string
}

export default function AdminPage() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({ totalCards: 0, pendingOrders: 0, totalViews: 0, newCustomers: 0 })
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (!res.ok) { router.push('/login'); return }
      const data = await res.json()
      if (data.user.role !== 'admin') { router.push('/dashboard'); return }
      setAdminUser({ name: data.user.name, username: data.user.username })

      const [cardsRes, ordersRes, usersRes] = await Promise.all([
        fetch('/api/cards'),
        fetch('/api/orders'),
        fetch('/api/users'),
      ])

      const cardsData = await cardsRes.json()
      const ordersData = await ordersRes.json()
      const usersData = await usersRes.json()

      const totalViews = (cardsData.cards || []).reduce(
        (sum: number, c: { views: number }) => sum + (c.views || 0),
        0
      )
      const pendingOrders = (ordersData.orders || []).filter(
        (o: { status: string }) => o.status === 'pending'
      ).length

      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const newCustomers = (usersData.users || []).filter(
        (u: { createdAt: string }) => new Date(u.createdAt) >= startOfMonth
      ).length

      setStats({
        totalCards: cardsData.cards?.length || 0,
        pendingOrders,
        totalViews,
        newCustomers,
      })
    } catch {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { label: 'Toplam Kartvizit', value: stats.totalCards },
    { label: 'Bekleyen Sipariş', value: stats.pendingOrders },
    { label: 'Toplam Görüntülenme', value: stats.totalViews },
    { label: 'Bu Ay Yeni Müşteri', value: stats.newCustomers },
  ]

  const quickActions = [
    { href: '/admin/orders', label: 'Siparişleri Yönet', desc: 'Bekleyen siparişleri işle' },
    { href: '/admin/cards/new', label: 'Yeni Kartvizit', desc: 'Manuel kart oluştur' },
    { href: '/admin/customers', label: 'Müşteriler', desc: 'Müşteri hesaplarını yönet' },
  ]

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#F5F0EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '24px',
            height: '24px',
            border: '2px solid #E0DCD7',
            borderTopColor: '#1A1A1A',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F0EB', display: 'flex' }}>
      <AdminSidebar />

      <main
        style={{ flex: 1, padding: '40px 32px' }}
        className="admin-main"
      >
        <div style={{ marginBottom: '40px' }}>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#1A1A1A',
              marginBottom: '4px',
            }}
          >
            Dashboard
          </h1>
          <p style={{ fontSize: '14px', color: '#6B6B6B' }}>
            Hoş geldiniz, {adminUser?.name || adminUser?.username || 'Admin'}
          </p>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            marginBottom: '48px',
          }}
          className="stats-grid"
        >
          {statCards.map((stat) => (
            <div
              key={stat.label}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E0DCD7',
                padding: '24px',
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#6B6B6B',
                  marginBottom: '10px',
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontSize: '40px',
                  fontWeight: 700,
                  color: '#1A1A1A',
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <div
            style={{
              fontSize: '11px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#6B6B6B',
              marginBottom: '16px',
            }}
          >
            Hızlı Erişim
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
            }}
            className="actions-grid"
          >
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E0DCD7',
                  padding: '28px',
                  textDecoration: 'none',
                  display: 'block',
                  transition: 'border-color 0.2s',
                }}
                className="quick-action-card"
              >
                <div
                  style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#1A1A1A',
                    marginBottom: '6px',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {action.label}
                </div>
                <div style={{ fontSize: '13px', color: '#6B6B6B' }}>{action.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .admin-main { margin-left: 240px; }
        .quick-action-card:hover { border-color: #1A1A1A !important; }
        @media (max-width: 1024px) {
          .admin-main { margin-left: 0 !important; padding-bottom: 80px !important; }
        }
        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .actions-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .admin-main { padding: 24px 16px !important; }
        }
      `}</style>
    </div>
  )
}
