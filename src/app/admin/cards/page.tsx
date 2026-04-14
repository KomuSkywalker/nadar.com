'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminSidebar from '@/components/layout/AdminSidebar'
import { templates } from '@/lib/templates'
import { Plus, Eye, Edit, Trash2, Copy, Check, ExternalLink } from 'lucide-react'

interface Card {
  id: string
  name: string
  title?: string | null
  company?: string | null
  templateId: number
  category?: string | null
  package?: string | null
  status: string
  views: number
  createdAt: string
  user?: { id: string; username: string; name: string } | null
}

export default function AdminCardsPage() {
  const router = useRouter()
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => { fetchCards() }, [])

  const fetchCards = async () => {
    const authRes = await fetch('/api/auth/me')
    if (!authRes.ok || (await authRes.json()).user.role !== 'admin') { router.push('/login'); return }
    const res = await fetch('/api/cards')
    const data = await res.json()
    setCards(data.cards || [])
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kartviziti silmek istediğinizden emin misiniz?')) return
    await fetch(`/api/cards/${id}`, { method: 'DELETE' })
    setCards((prev) => prev.filter((c) => c.id !== id))
  }

  const copyLink = (id: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/card/${id}`)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F0EB', display: 'flex' }}>
      <AdminSidebar />

      <main style={{ flex: 1, padding: '40px 32px' }} className="admin-main">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '24px',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: '#1A1A1A',
                marginBottom: '4px',
              }}
            >
              Kartvizitler
            </h1>
            <p style={{ fontSize: '14px', color: '#6B6B6B' }}>{cards.length} kartvizit</p>
          </div>
          <Link
            href="/admin/cards/new"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 20px',
              background: '#1A1A1A',
              color: '#FFFFFF',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              transition: 'background 0.2s',
            }}
          >
            <Plus size={14} />
            Yeni Kartvizit
          </Link>
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
        ) : cards.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontSize: '14px', color: '#9B9B9B', marginBottom: '16px' }}>
              Henüz kartvizit yok
            </p>
            <Link
              href="/admin/cards/new"
              style={{
                fontSize: '13px',
                color: '#1A1A1A',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
              }}
            >
              İlk kartviziti oluştur
            </Link>
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
                  <th>Kartvizit</th>
                  <th className="hide-sm">Şablon</th>
                  <th className="hide-md">Paket</th>
                  <th>Görüntülenme</th>
                  <th>Durum</th>
                  <th style={{ textAlign: 'right' }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {cards.map((card) => {
                  const tpl = templates.find((t) => t.id === card.templateId) || templates[0]
                  return (
                    <tr key={card.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {/* Mini template preview */}
                          <div
                            style={{
                              width: '36px',
                              height: '48px',
                              borderRadius: '4px',
                              overflow: 'hidden',
                              flexShrink: 0,
                            }}
                            className={`bg-gradient-to-br ${tpl.bg}`}
                          />
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: 500, color: '#1A1A1A' }}>
                              {card.name}
                            </div>
                            {card.title && (
                              <div style={{ fontSize: '12px', color: '#9B9B9B' }}>{card.title}</div>
                            )}
                            {card.user && (
                              <div style={{ fontSize: '11px', color: '#9B9B9B' }}>
                                @{card.user.username}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="hide-sm">
                        <span style={{ fontSize: '13px', color: '#6B6B6B' }}>{tpl.name}</span>
                      </td>
                      <td className="hide-md">
                        {card.package ? (
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
                            {card.package}
                          </span>
                        ) : (
                          <span style={{ color: '#9B9B9B', fontSize: '13px' }}>—</span>
                        )}
                      </td>
                      <td>
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#1A1A1A',
                          }}
                        >
                          <Eye size={13} style={{ color: '#6B6B6B' }} />
                          {card.views}
                        </span>
                      </td>
                      <td>
                        <span
                          className={card.status === 'active' ? 'badge badge-active' : 'badge badge-inactive'}
                        >
                          {card.status === 'active' ? 'Aktif' : card.status}
                        </span>
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
                          <Link
                            href={`/card/${card.id}`}
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
                          <button
                            onClick={() => copyLink(card.id)}
                            style={{
                              padding: '6px',
                              border: '1px solid #E0DCD7',
                              color: '#6B6B6B',
                              background: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              transition: 'all 0.15s',
                            }}
                            className="table-action-btn"
                          >
                            {copied === card.id ? (
                              <Check size={13} style={{ color: '#065F46' }} />
                            ) : (
                              <Copy size={13} />
                            )}
                          </button>
                          <Link
                            href={`/admin/cards/${card.id}/edit`}
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
                          <button
                            onClick={() => handleDelete(card.id)}
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
                  )
                })}
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
