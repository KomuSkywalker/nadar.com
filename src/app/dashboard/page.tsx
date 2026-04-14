'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import CardTemplate from '@/components/card/CardTemplate'
import { Copy, Check, ExternalLink, LogOut, Save } from 'lucide-react'

interface CardData {
  id: string
  name: string
  title?: string | null
  company?: string | null
  bio?: string | null
  phone?: string | null
  email?: string | null
  address?: string | null
  website?: string | null
  instagram?: string | null
  twitter?: string | null
  linkedin?: string | null
  facebook?: string | null
  tiktok?: string | null
  youtube?: string | null
  whatsapp?: string | null
  photoUrl?: string | null
  mapLink?: string | null
  portfolio?: string | null
  templateId: number
  views: number
  canEdit: boolean
  canViewStats: boolean
}

interface UserData {
  id: string
  username: string
  name: string
  email: string
  role: string
  cardId: string | null
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [card, setCard] = useState<CardData | null>(null)
  const [form, setForm] = useState<Partial<CardData>>({})
  const [stats, setStats] = useState({ views: 0, recentViews: 0 })
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'preview' | 'edit'>('preview')

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (!res.ok) { router.push('/login'); return }
      const data = await res.json()
      if (data.user.role === 'admin') { router.push('/admin'); return }
      setUser(data.user)

      if (data.user.cardId) {
        const [cardRes, statsRes] = await Promise.all([
          fetch(`/api/cards/${data.user.cardId}`),
          fetch(`/api/cards/${data.user.cardId}/stats`),
        ])
        const cardData = await cardRes.json()
        const statsData = await statsRes.json()
        if (cardData.card) {
          setCard(cardData.card)
          setForm(cardData.card)
          setStats({ views: statsData.views || 0, recentViews: statsData.recentViews || 0 })
        }
      }
    } catch {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  const handleCopy = () => {
    if (!card) return
    navigator.clipboard.writeText(`${window.location.origin}/card/${card.id}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = async () => {
    if (!card) return
    setSaving(true)
    try {
      const res = await fetch(`/api/cards/${card.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const data = await res.json()
        setCard(data.card)
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 2000)
      }
    } finally {
      setSaving(false)
    }
  }

  const setField = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }))
  }

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
    <div style={{ minHeight: '100vh', background: '#F5F0EB' }}>
      {/* Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: '#F5F0EB',
          borderBottom: '1px solid #E0DCD7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
        }}
      >
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span
            style={{
              fontSize: '20px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: '#1A1A1A',
            }}
          >
            NADAR
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {user && (
            <span style={{ fontSize: '13px', color: '#6B6B6B' }}>
              {user.name}
            </span>
          )}
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              color: '#6B6B6B',
              padding: 0,
            }}
          >
            <LogOut size={14} />
            Çıkış
          </button>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        {!card ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '50vh',
              textAlign: 'center',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  marginBottom: '12px',
                  color: '#1A1A1A',
                }}
              >
                Henüz kartvizitiniz yok
              </div>
              <p style={{ fontSize: '15px', color: '#6B6B6B', marginBottom: '32px' }}>
                Sipariş vererek dijital kartvizitinizi oluşturun.
              </p>
              <Link href="/order" className="btn-primary">
                Sipariş Ver
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: card.canViewStats ? 'repeat(3, 1fr)' : '1fr',
                gap: '16px',
                marginBottom: '32px',
              }}
              className="stats-grid"
            >
              {card.canViewStats && (
                <div style={{ background: '#FFFFFF', border: '1px solid #E0DCD7', padding: '24px' }}>
                  <div style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B6B6B', marginBottom: '8px' }}>
                    Toplam Görüntülenme
                  </div>
                  <div style={{ fontSize: '36px', fontWeight: 700, color: '#1A1A1A', lineHeight: 1 }}>
                    {stats.views}
                  </div>
                </div>
              )}

              {card.canViewStats && (
                <div style={{ background: '#FFFFFF', border: '1px solid #E0DCD7', padding: '24px' }}>
                  <div style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B6B6B', marginBottom: '8px' }}>
                    Son 7 Gün
                  </div>
                  <div style={{ fontSize: '36px', fontWeight: 700, color: '#1A1A1A', lineHeight: 1 }}>
                    {stats.recentViews}
                  </div>
                </div>
              )}

              <div
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
                  Kartvizit Linki
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <code
                    style={{
                      fontSize: '12px',
                      color: '#1A1A1A',
                      flex: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    /card/{card.id.slice(0, 12)}...
                  </code>
                  <button
                    onClick={handleCopy}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1A1A1A', padding: '2px' }}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                  <Link
                    href={`/card/${card.id}`}
                    target="_blank"
                    style={{ color: '#6B6B6B', display: 'flex' }}
                  >
                    <ExternalLink size={14} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div
              style={{
                display: 'flex',
                borderBottom: '1px solid #E0DCD7',
                marginBottom: '32px',
              }}
            >
              {(['preview', ...(card.canEdit ? ['edit'] : [])] as ('preview' | 'edit')[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '12px 24px',
                    background: 'none',
                    border: 'none',
                    borderBottom: activeTab === tab ? '2px solid #1A1A1A' : '2px solid transparent',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 500,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: activeTab === tab ? '#1A1A1A' : '#6B6B6B',
                    marginBottom: '-1px',
                    transition: 'all 0.2s',
                  }}
                >
                  {tab === 'preview' ? 'Önizleme' : 'Düzenle'}
                </button>
              ))}
            </div>

            {activeTab === 'preview' ? (
              <div>
                <Link
                  href={`/card/${card.id}`}
                  target="_blank"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: '#6B6B6B',
                    textDecoration: 'none',
                    marginBottom: '24px',
                  }}
                >
                  <ExternalLink size={12} />
                  Kartviziti aç
                </Link>
                <div style={{ border: '1px solid #E0DCD7', overflow: 'hidden' }}>
                  <CardTemplate card={form as CardData} />
                </div>
              </div>
            ) : (
              <div style={{ maxWidth: '640px' }}>
                <div
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E0DCD7',
                    padding: '32px',
                  }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '20px',
                      marginBottom: '20px',
                    }}
                    className="edit-grid"
                  >
                    {[
                      { field: 'name', label: 'Ad Soyad', placeholder: 'Adınız Soyadınız' },
                      { field: 'title', label: 'Ünvan', placeholder: 'Danışman, Doktor...' },
                      { field: 'company', label: 'Şirket', placeholder: 'Şirket adı' },
                      { field: 'phone', label: 'Telefon', placeholder: '+90 5xx xxx xx xx' },
                      { field: 'email', label: 'E-posta', placeholder: 'email@ornek.com' },
                      { field: 'website', label: 'Website / Portföy', placeholder: 'www.sitesi.com' },
                      { field: 'address', label: 'Adres / Konum', placeholder: 'Şehir, İlçe' },
                      { field: 'whatsapp', label: 'WhatsApp', placeholder: '+90 5xx xxx xx xx' },
                      { field: 'instagram', label: 'Instagram', placeholder: '@kullanici' },
                      { field: 'twitter', label: 'Twitter/X', placeholder: '@kullanici' },
                      { field: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/...' },
                      { field: 'facebook', label: 'Facebook', placeholder: 'fb.com/...' },
                    ].map(({ field, label, placeholder }) => (
                      <div key={field}>
                        <label className="input-label">{label}</label>
                        <input
                          className="input-field"
                          value={(form as Record<string, string>)[field] || ''}
                          onChange={(e) => setField(field, e.target.value)}
                          placeholder={placeholder}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Bio */}
                  <div style={{ marginBottom: '24px' }}>
                    <label className="input-label">Tanıtım Yazısı / Bio</label>
                    <textarea
                      className="input-field"
                      style={{ height: '80px', resize: 'none' }}
                      value={(form as Record<string, string>)['bio'] || ''}
                      onChange={(e) => setField('bio', e.target.value)}
                      placeholder="Kendinizi kısaca tanıtın..."
                    />
                  </div>

                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary"
                    style={{
                      opacity: saving ? 0.6 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    {saving ? (
                      'Kaydediliyor...'
                    ) : saveSuccess ? (
                      <><Check size={16} /> Kaydedildi</>
                    ) : (
                      <><Save size={16} /> Kaydet</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .edit-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
