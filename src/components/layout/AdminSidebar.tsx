'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, ShoppingBag, CreditCard, Users, LogOut } from 'lucide-react'

const navLinks = [
  { href: '/admin', icon: LayoutDashboard, label: 'Genel' },
  { href: '/admin/orders', icon: ShoppingBag, label: 'Siparişler' },
  { href: '/admin/cards', icon: CreditCard, label: 'Kartvizitler' },
  { href: '/admin/customers', icon: Users, label: 'Müşteriler' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: '240px',
          background: '#1A1A1A',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 50,
          borderRight: '1px solid #2A2A2A',
        }}
        className="admin-sidebar-desktop"
      >
        {/* Logo */}
        <div
          style={{
            padding: '24px',
            borderBottom: '1px solid #2A2A2A',
          }}
        >
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div
              style={{
                fontSize: '20px',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: '#FFFFFF',
                lineHeight: 1,
                marginBottom: '4px',
              }}
            >
              NADAR
            </div>
          </Link>
          <div
            style={{
              fontSize: '11px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: '#4A4A4A',
            }}
          >
            Admin
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 0' }}>
          {navLinks.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== '/admin' && pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 24px',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: 400,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: active ? '#FFFFFF' : '#666666',
                  borderLeft: active ? '2px solid #FFFFFF' : '2px solid transparent',
                  transition: 'all 0.15s ease',
                  background: active ? 'rgba(255,255,255,0.04)' : 'transparent',
                }}
              >
                <link.icon size={15} strokeWidth={1.5} />
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: '16px 0', borderTop: '1px solid #2A2A2A' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 24px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 400,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: '#4A4A4A',
              width: '100%',
              transition: 'color 0.15s',
            }}
            className="admin-logout-btn"
          >
            <LogOut size={15} strokeWidth={1.5} />
            Çıkış
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#1A1A1A',
          borderTop: '1px solid #2A2A2A',
          display: 'flex',
          justifyContent: 'space-around',
          padding: '10px 0',
          zIndex: 50,
        }}
        className="admin-mobile-nav"
      >
        {navLinks.map((link) => {
          const active =
            pathname === link.href ||
            (link.href !== '/admin' && pathname.startsWith(link.href))
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                textDecoration: 'none',
                color: active ? '#FFFFFF' : '#4A4A4A',
                transition: 'color 0.15s',
              }}
            >
              <link.icon size={18} strokeWidth={1.5} />
              <span
                style={{
                  fontSize: '9px',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                {link.label}
              </span>
            </Link>
          )
        })}
      </div>

      <style>{`
        .admin-sidebar-desktop { display: flex !important; }
        .admin-mobile-nav { display: none !important; }
        .admin-logout-btn:hover { color: #FFFFFF !important; }

        @media (max-width: 1024px) {
          .admin-sidebar-desktop { display: none !important; }
          .admin-mobile-nav { display: flex !important; }
        }
      `}</style>
    </>
  )
}
