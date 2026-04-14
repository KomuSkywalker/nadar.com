'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminSidebar from '@/components/layout/AdminSidebar'
import { templates } from '@/lib/templates'
import { Trash2, Wand2, Copy, Check } from 'lucide-react'

interface Order {
  id: string
  status: string
  name: string
  phone: string
  email: string
  company?: string | null
  title?: string | null
  category?: string | null
  package?: string | null
  templateId?: number | null
  notes?: string | null
  createdAt: string
  card?: { id: string; name: string } | null
}

interface CreatedCardInfo {
  card: { id: string }
  user: { username: string; rawPassword: string }
  cardUrl: string
}

const statusLabels: Record<string, string> = {
  pending: 'Bekliyor',
  processing: 'İşleniyor',
  done: 'Tamamlandı',
  cancelled: 'İptal',
}

const statusBadge: Record<string, string> = {
  pending: 'badge badge-pending',
  processing: 'badge badge-processing',
  done: 'badge badge-done',
  cancelled: 'badge badge-cancelled',
}

export default function AdminOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState<string | null>(null)
  const [createdInfo, setCreatedInfo] = useState<{ [key: string]: CreatedCardInfo }>({})
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    const res = await fetch('/api/auth/me')
    if (!res.ok || (await res.json()).user.role !== 'admin') { router.push('/login'); return }
    const ordRes = await fetch('/api/orders')
    const data = await ordRes.json()
    setOrders(data.orders || [])
    setLoading(false)
  }

  const handleCreateCard = async (order: Order) => {
    setCreating(order.id)
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'done', createCard: true }),
      })
      const data = await res.json()
      if (res.ok) {
        setCreatedInfo((prev) => ({ ...prev, [order.id]: data }))
        setOrders((prev) =>
          prev.map((o) => (o.id === order.id ? { ...o, status: 'done', card: data.card } : o))
        )
      }
    } finally {
      setCreating(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu siparişi silmek istediğinizden emin misiniz?')) return
    await fetch(`/api/orders/${id}`, { method: 'DELETE' })
    setOrders((prev) => prev.filter((o) => o.id !== id))
  }

  const handleStatusChange = async (id: string, status: string) => {
    await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
  }

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(key)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  const filterTabs = [
    { value: 'all', label: 'Tümü' },
    { value: 'pending', label: 'Bekliyor' },
    { value: 'processing', label: 'İşleniyor' },
    { value: 'done', label: 'Tamamlandı' },
    { value: 'cancelled', label: 'İptal' },
  ]

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
            Siparişler
          </h1>
          <p style={{ fontSize: '14px', color: '#6B6B6B' }}>{orders.length} sipariş</p>
        </div>

        {/* Filter tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0',
            borderBottom: '1px solid #E0DCD7',
            marginBottom: '28px',
          }}
        >
          {filterTabs.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                padding: '10px 18px',
                background: 'none',
                border: 'none',
                borderBottom: filter === f.value ? '2px solid #1A1A1A' : '2px solid transparent',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '0.03em',
                color: filter === f.value ? '#1A1A1A' : '#6B6B6B',
                marginBottom: '-1px',
                transition: 'all 0.15s',
              }}
            >
              {f.label}
              {f.value !== 'all' && (
                <span
                  style={{
                    marginLeft: '6px',
                    fontSize: '11px',
                    color: '#9B9B9B',
                  }}
                >
                  ({orders.filter((o) => o.status === f.value).length})
                </span>
              )}
            </button>
          ))}
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
            Sipariş bulunamadı
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {filtered.map((order, idx) => {
              const info = createdInfo[order.id]
              const tpl = templates.find((t) => t.id === (order.templateId || 1))

              return (
                <div
                  key={order.id}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E0DCD7',
                    borderTop: idx > 0 ? 'none' : '1px solid #E0DCD7',
                    padding: '24px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '20px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Header row */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          marginBottom: '10px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '16px',
                            fontWeight: 600,
                            color: '#1A1A1A',
                            letterSpacing: '-0.01em',
                          }}
                        >
                          {order.name}
                        </span>
                        <span className={statusBadge[order.status] || 'badge badge-pending'}>
                          {statusLabels[order.status] || order.status}
                        </span>
                        {order.package && (
                          <span
                            style={{
                              fontSize: '11px',
                              letterSpacing: '0.05em',
                              textTransform: 'uppercase',
                              color: '#6B6B6B',
                              border: '1px solid #E0DCD7',
                              padding: '2px 8px',
                            }}
                          >
                            {order.package}
                          </span>
                        )}
                      </div>

                      {/* Details */}
                      <div
                        style={{
                          fontSize: '13px',
                          color: '#6B6B6B',
                          display: 'flex',
                          gap: '20px',
                          flexWrap: 'wrap',
                          marginBottom: '8px',
                        }}
                      >
                        <span>{order.phone}</span>
                        <span>{order.email}</span>
                        {order.company && <span>{order.company}</span>}
                        {order.title && <span>{order.title}</span>}
                        {tpl && <span>Şablon: {tpl.name}</span>}
                      </div>

                      {order.notes && (
                        <div
                          style={{
                            fontSize: '13px',
                            color: '#6B6B6B',
                            background: '#F5F0EB',
                            padding: '10px 14px',
                            marginBottom: '8px',
                          }}
                        >
                          Not: {order.notes}
                        </div>
                      )}

                      <div style={{ fontSize: '12px', color: '#9B9B9B' }}>
                        {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                      {(order.status === 'pending' || order.status === 'processing') && (
                        <>
                          {order.status === 'pending' && (
                            <button
                              onClick={() => handleStatusChange(order.id, 'processing')}
                              style={{
                                padding: '8px 16px',
                                fontSize: '12px',
                                letterSpacing: '0.05em',
                                textTransform: 'uppercase',
                                background: 'none',
                                border: '1px solid #E0DCD7',
                                color: '#6B6B6B',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                              }}
                            >
                              İşleme Al
                            </button>
                          )}
                          <button
                            onClick={() => handleCreateCard(order)}
                            disabled={creating === order.id}
                            style={{
                              padding: '8px 16px',
                              fontSize: '12px',
                              letterSpacing: '0.05em',
                              textTransform: 'uppercase',
                              background: '#1A1A1A',
                              color: '#FFFFFF',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              opacity: creating === order.id ? 0.6 : 1,
                              transition: 'opacity 0.2s',
                            }}
                          >
                            {creating === order.id ? (
                              <div
                                style={{
                                  width: '12px',
                                  height: '12px',
                                  border: '2px solid rgba(255,255,255,0.3)',
                                  borderTopColor: '#FFFFFF',
                                  borderRadius: '50%',
                                  animation: 'spin 0.8s linear infinite',
                                }}
                              />
                            ) : (
                              <Wand2 size={12} />
                            )}
                            Kart Oluştur
                          </button>
                        </>
                      )}
                      {order.card && (
                        <Link
                          href={`/card/${order.card.id}`}
                          target="_blank"
                          style={{
                            padding: '8px 16px',
                            fontSize: '12px',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            background: 'none',
                            border: '1px solid #E0DCD7',
                            color: '#1A1A1A',
                            textDecoration: 'none',
                            textAlign: 'center',
                            display: 'block',
                          }}
                        >
                          Kartı Gör
                        </Link>
                      )}
                      <button
                        onClick={() => handleDelete(order.id)}
                        style={{
                          padding: '8px 16px',
                          fontSize: '12px',
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                          background: 'none',
                          border: '1px solid #E0DCD7',
                          color: '#9B9B9B',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s',
                        }}
                      >
                        <Trash2 size={12} />
                        Sil
                      </button>
                    </div>
                  </div>

                  {/* Created card credentials */}
                  {info && (
                    <div
                      style={{
                        marginTop: '20px',
                        background: '#F5F0EB',
                        border: '1px solid #E0DCD7',
                        padding: '20px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '12px',
                          fontWeight: 500,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: '#065F46',
                          marginBottom: '16px',
                        }}
                      >
                        Kartvizit oluşturuldu — Müşteriye iletin
                      </div>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(3, 1fr)',
                          gap: '12px',
                        }}
                        className="cred-grid"
                      >
                        {[
                          { label: 'Kullanıcı Adı', value: info.user.username, key: 'username' },
                          { label: 'Şifre', value: info.user.rawPassword, key: 'password' },
                          {
                            label: 'Kartvizit Linki',
                            value: `${typeof window !== 'undefined' ? window.location.origin : ''}/card/${info.card.id}`,
                            key: 'link',
                          },
                        ].map((item) => (
                          <div
                            key={item.key}
                            style={{
                              background: '#FFFFFF',
                              border: '1px solid #E0DCD7',
                              padding: '12px 14px',
                            }}
                          >
                            <div
                              style={{
                                fontSize: '10px',
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                color: '#9B9B9B',
                                marginBottom: '6px',
                              }}
                            >
                              {item.label}
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                              }}
                            >
                              <code
                                style={{
                                  fontSize: '13px',
                                  color: '#1A1A1A',
                                  flex: 1,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {item.value}
                              </code>
                              <button
                                onClick={() => copyText(item.value, item.key + info.card.id)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  color: '#6B6B6B',
                                  flexShrink: 0,
                                  padding: '2px',
                                }}
                              >
                                {copiedField === item.key + info.card.id ? (
                                  <Check size={13} style={{ color: '#065F46' }} />
                                ) : (
                                  <Copy size={13} />
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .admin-main { margin-left: 240px; }
        @media (max-width: 1024px) {
          .admin-main { margin-left: 0 !important; padding-bottom: 80px !important; }
        }
        @media (max-width: 768px) {
          .admin-main { padding: 24px 16px !important; }
          .cred-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
