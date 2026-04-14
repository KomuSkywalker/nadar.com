'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminSidebar from '@/components/layout/AdminSidebar'
import { ExternalLink, Trash2, Edit } from 'lucide-react'

interface Customer {
  id: string
  username: string
  email: string
  name: string
  role: string
  cardId?: string | null
  createdAt: string
  card?: { id: string; name: string; views: number } | null
}

export default function AdminCustomersPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => { fetchCustomers() }, [])

  const fetchCustomers = async () => {
    const authRes = await fetch('/api/auth/me')
    if (!authRes.ok || (await authRes.json()).user.role !== 'admin') { router.push('/login'); return }
    const res = await fetch('/api/users')
    const data = await res.json()
    setCustomers(data.users || [])
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu müşteriyi silmek istediğinizden emin misiniz?')) return
    await fetch(`/api/users/${id}`, { method: 'DELETE' })
    setCustomers((prev) => prev.filter((c) => c.id !== id))
  }

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.username.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ minHeight: '100vh', background: '#F5F0EB', display: 'flex' }}>
      <AdminSidebar />

      <main style={{ flex: 1, padding: '40px 32px' }} className="admin-main">
        <div style={{ marginBottom: '32px' }}>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#1A1A1A',
              marginBottom: '4px',
            }}
          >
            Müşteriler
          </h1>
          <p style={{ fontSize: '14px', color: '#6B6B6B' }}>{customers.length} müşteri</p>
        </div>

        {/* Search */}
        <div style={{ marginBottom: '24px', maxWidth: '320px' }}>
          <input
            className="input-field"
            placeholder="İsim, e-posta veya kullanıcı adı ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
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
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#9B9B9B', fontSize: '14px' }}>
            Müşteri bulunamadı
          </div>
        ) : (
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E0DCD7',
              overflow: 'hidden',
            }}
          >
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Müşteri</th>
                  <th className="hide-sm">E-posta</th>
                  <th className="hide-lg">Kullanıcı Adı</th>
                  <th className="hide-lg">Görüntülenme</th>
                  <th className="hide-md">Kayıt Tarihi</th>
                  <th style={{ textAlign: 'right' }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            background: '#F5F0EB',
                            border: '1px solid #E0DCD7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            fontWeight: 700,
                            color: '#1A1A1A',
                            flexShrink: 0,
                          }}
                        >
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 500, color: '#1A1A1A' }}>
                            {customer.name}
                          </div>
                          {customer.card && (
                            <div style={{ fontSize: '12px', color: '#9B9B9B' }}>
                              {customer.card.name}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="hide-sm">{customer.email}</td>
                    <td className="hide-lg">
                      <code
                        style={{
                          fontSize: '12px',
                          background: '#F5F0EB',
                          padding: '3px 8px',
                          color: '#6B6B6B',
                        }}
                      >
                        @{customer.username}
                      </code>
                    </td>
                    <td className="hide-lg">
                      {customer.card ? (
                        <span style={{ fontSize: '14px', color: '#1A1A1A', fontWeight: 600 }}>
                          {customer.card.views}
                        </span>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#9B9B9B' }}>—</span>
                      )}
                    </td>
                    <td className="hide-md" style={{ color: '#6B6B6B' }}>
                      {new Date(customer.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          gap: '6px',
                        }}
                      >
                        {customer.cardId && (
                          <Link
                            href={`/card/${customer.cardId}`}
                            target="_blank"
                            style={{
                              padding: '6px',
                              border: '1px solid #E0DCD7',
                              color: '#6B6B6B',
                              display: 'flex',
                              transition: 'all 0.15s',
                            }}
                            className="table-action-btn"
                          >
                            <ExternalLink size={13} />
                          </Link>
                        )}
                        {customer.cardId && (
                          <Link
                            href={`/admin/cards/${customer.cardId}/edit`}
                            style={{
                              padding: '6px',
                              border: '1px solid #E0DCD7',
                              color: '#6B6B6B',
                              display: 'flex',
                              transition: 'all 0.15s',
                            }}
                            className="table-action-btn"
                          >
                            <Edit size={13} />
                          </Link>
                        )}
                        <button
                          onClick={() => handleDelete(customer.id)}
                          style={{
                            padding: '6px',
                            border: '1px solid #E0DCD7',
                            color: '#9B9B9B',
                            background: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            transition: 'all 0.15s',
                          }}
                          className="table-action-btn"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .admin-main { margin-left: 240px; }
        .table-action-btn:hover { border-color: #1A1A1A !important; color: #1A1A1A !important; }
        @media (max-width: 1024px) {
          .admin-main { margin-left: 0 !important; padding-bottom: 80px !important; }
        }
        @media (max-width: 900px) {
          .hide-lg { display: none !important; }
        }
        @media (max-width: 768px) {
          .admin-main { padding: 24px 16px !important; }
          .hide-md { display: none !important; }
        }
        @media (max-width: 600px) {
          .hide-sm { display: none !important; }
        }
      `}</style>
    </div>
  )
}
