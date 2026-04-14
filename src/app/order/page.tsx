'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { packages } from '@/lib/packages'
import { categories } from '@/lib/categories'
import { templates, type Template } from '@/lib/templates'
import { ArrowLeft } from 'lucide-react'

function MiniCardPreview({ tpl }: { tpl: Template }) {
  const isLight = tpl.theme === 'light'
  const lineColor = isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.25)'
  return (
    <div style={{
      width: '100%', height: '100%',
      background: isLight ? '#fff' : undefined,
      backgroundImage: isLight ? undefined : `linear-gradient(135deg, var(--c1), var(--c2))`,
    }} className={isLight ? '' : `bg-gradient-to-br ${tpl.bg}`}>
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '10px 8px', gap: 0,
      }}>
        {/* avatar */}
        <div style={{
          width: 18, height: 18, borderRadius: '50%',
          border: `1.5px solid ${tpl.accentHex}`,
          background: `${tpl.accentHex}22`,
          marginBottom: 6,
        }} />
        {/* name */}
        <div style={{ width: '70%', height: 4, background: isLight ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.8)', borderRadius: 2, marginBottom: 4 }} />
        {/* accent line */}
        <div style={{ width: '45%', height: 2, background: tpl.accentHex, borderRadius: 1, marginBottom: 8, boxShadow: `0 0 4px ${tpl.accentHex}66` }} />
        {/* contact lines */}
        <div style={{ width: '65%', height: 3, background: lineColor, borderRadius: 2, marginBottom: 4 }} />
        <div style={{ width: '55%', height: 3, background: lineColor, borderRadius: 2 }} />
      </div>
    </div>
  )
}

function OrderForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultPackage = searchParams.get('package') || 'starter'

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    title: '',
    category: '',
    package: defaultPackage,
    templateId: '1',
    notes: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const selectedPkg = packages.find((p) => p.id === form.package) || packages[0]
  const availableTemplates = templates.slice(0, selectedPkg.templateCount)

  const set = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Sipariş oluşturulamadı')
        return
      }

      setSubmitted(true)
    } catch {
      setError('Bağlantı hatası')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#F5F0EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <div>
          <div
            style={{
              width: '64px',
              height: '1px',
              background: '#1A1A1A',
              margin: '0 auto 32px',
            }}
          />
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              marginBottom: '16px',
              color: '#1A1A1A',
            }}
          >
            Siparişiniz alındı
          </h1>
          <p
            style={{
              fontSize: '15px',
              color: '#6B6B6B',
              marginBottom: '40px',
              maxWidth: '360px',
            }}
          >
            En kısa sürede kartvizitiniz hazırlanacak ve size iletilecektir. Teşekkürler.
          </p>
          <Link href="/" className="btn-secondary">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F0EB' }}>
      {/* Top bar */}
      <div
        style={{
          borderBottom: '1px solid #E0DCD7',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#F5F0EB',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div
            style={{
              fontSize: '20px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: '#1A1A1A',
            }}
          >
            NADAR
          </div>
        </Link>
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: '#6B6B6B',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={14} />
          Geri
        </Link>
      </div>

      {/* Form */}
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ marginBottom: '48px' }}>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#1A1A1A',
              marginBottom: '8px',
            }}
          >
            Sipariş Oluşturun
          </h1>
          <p style={{ fontSize: '15px', color: '#6B6B6B' }}>
            Kişisel bilgilerinizi girin, kartvizitinizi hazırlayalım.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Name */}
          <div>
            <label className="input-label">Ad Soyad *</label>
            <input
              className="input-field"
              required
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Ahmet Yılmaz"
            />
          </div>

          {/* Phone + Email */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="two-col">
            <div>
              <label className="input-label">Telefon *</label>
              <input
                className="input-field"
                required
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                placeholder="+90 5xx xxx xx xx"
              />
            </div>
            <div>
              <label className="input-label">E-posta *</label>
              <input
                className="input-field"
                type="email"
                required
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="ahmet@sirket.com"
              />
            </div>
          </div>

          {/* Company + Title */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="two-col">
            <div>
              <label className="input-label">Şirket / İşletme</label>
              <input
                className="input-field"
                value={form.company}
                onChange={(e) => set('company', e.target.value)}
                placeholder="Şirket adı"
              />
            </div>
            <div>
              <label className="input-label">Ünvan</label>
              <input
                className="input-field"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="Yönetici, Danışman..."
              />
            </div>
          </div>

          {/* Sector */}
          <div>
            <label className="input-label">Sektör *</label>
            <select
              className="input-field"
              required
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              style={{ appearance: 'none', cursor: 'pointer' }}
            >
              <option value="">Seçiniz...</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Package */}
          <div>
            <label className="input-label">Paket</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {packages.map((pkg) => (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => {
                    set('package', pkg.id)
                    set('templateId', '1')
                  }}
                  style={{
                    padding: '16px',
                    border: form.package === pkg.id ? '2px solid #1A1A1A' : '1px solid #E0DCD7',
                    background: form.package === pkg.id ? '#1A1A1A' : '#FFFFFF',
                    color: form.package === pkg.id ? '#FFFFFF' : '#1A1A1A',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      letterSpacing: '0.02em',
                      textTransform: 'uppercase',
                      marginBottom: '4px',
                    }}
                  >
                    {pkg.name}
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 700 }}>₺{pkg.price}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Template */}
          <div>
            <label className="input-label">
              Şablon{' '}
              <span style={{ color: '#9B9B9B', textTransform: 'none', letterSpacing: 0 }}>
                ({selectedPkg.name} ile {selectedPkg.templateCount} şablon)
              </span>
            </label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {availableTemplates.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => set('templateId', String(tpl.id))}
                  style={{
                    width: '80px',
                    aspectRatio: '2/3',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: form.templateId === String(tpl.id) ? '3px solid #1A1A1A' : '2px solid #E0DCD7',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'border-color 0.2s',
                    background: 'none',
                    padding: 0,
                  }}
                  title={tpl.name}
                >
                  <MiniCardPreview tpl={tpl} />
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'rgba(0,0,0,0.55)', padding: '4px',
                    textAlign: 'center', fontSize: '9px', color: '#fff',
                    letterSpacing: '0.03em', textTransform: 'uppercase',
                  }}>
                    {tpl.name}
                  </div>
                </button>
              ))}
              {templates.slice(selectedPkg.templateCount).map((tpl) => (
                <div
                  key={tpl.id}
                  style={{
                    width: '80px',
                    aspectRatio: '2/3',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '2px solid #E0DCD7',
                    opacity: 0.35,
                    position: 'relative',
                  }}
                  title={`${tpl.name} — Bu paket için mevcut değil`}
                >
                  <MiniCardPreview tpl={tpl} />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(0,0,0,0.4)',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2}>
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="input-label">Ek Notlar</label>
            <textarea
              className="input-field"
              style={{ height: '100px', resize: 'none' }}
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              placeholder="Kartvizitiniz için özel isteklerinizi yazın..."
            />
          </div>

          {error && (
            <div
              style={{
                background: '#FEF2F2',
                border: '1px solid #FCA5A5',
                padding: '12px 16px',
                fontSize: '14px',
                color: '#991B1B',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ opacity: loading ? 0.6 : 1, marginTop: '8px' }}
          >
            {loading ? 'Gönderiliyor...' : 'Siparişi Gönder'}
          </button>
        </form>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .two-col {
            grid-template-columns: 1fr !important;
          }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default function OrderPage() {
  return (
    <Suspense
      fallback={
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
        </div>
      }
    >
      <OrderForm />
    </Suspense>
  )
}
