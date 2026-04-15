'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import AdminSidebar from '@/components/layout/AdminSidebar'
import CardTemplate from '@/components/card/CardTemplate'
import type { CardData } from '@/components/card/CardTemplate'
import { categories } from '@/lib/categories'
import { templates } from '@/lib/templates'
import { packages } from '@/lib/packages'
import { ArrowLeft, Save, Check, Upload } from 'lucide-react'
import type { Template } from '@/lib/templates'
import ImageCropper from '@/components/ImageCropper'

function MiniCardPreview({ tpl }: { tpl: Template }) {
  const isLight = tpl.theme === 'light'
  const lineColor = isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.25)'
  return (
    <div style={{ width: '100%', height: '100%' }} className={`bg-gradient-to-br ${tpl.bg}`}>
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '8px 6px',
      }}>
        <div style={{
          width: 16, height: 16, borderRadius: '50%',
          border: `1.5px solid ${tpl.accentHex}`,
          background: `${tpl.accentHex}22`,
          marginBottom: 5,
        }} />
        <div style={{ width: '70%', height: 4, background: isLight ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.8)', borderRadius: 2, marginBottom: 4 }} />
        <div style={{ width: '45%', height: 2, background: tpl.accentHex, borderRadius: 1, marginBottom: 7, boxShadow: `0 0 4px ${tpl.accentHex}66` }} />
        <div style={{ width: '65%', height: 3, background: lineColor, borderRadius: 2, marginBottom: 3 }} />
        <div style={{ width: '55%', height: 3, background: lineColor, borderRadius: 2 }} />
      </div>
    </div>
  )
}

const FIELD_LABELS: Record<string, string> = {
  name: 'Ad Soyad',
  title: 'Ünvan',
  company: 'Şirket',
  phone: 'Telefon',
  whatsapp: 'WhatsApp',
  email: 'E-posta',
  address: 'Adres',
  website: 'Website',
  instagram: 'Instagram',
  twitter: 'Twitter/X',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  mapLink: 'Harita Linki',
  portfolio: 'Portföy Linki',
}

type CardForm = Partial<CardData> & {
  status?: string
  category?: string
  package?: string
  canEdit?: boolean
  canViewStats?: boolean
  allowedTemplates?: number[]
}

export default function EditCardPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [form, setForm] = useState<CardForm>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [cropSrc, setCropSrc] = useState<string | null>(null)

  const fetchCard = useCallback(async () => {
    const authRes = await fetch('/api/auth/me')
    if (!authRes.ok || (await authRes.json()).user?.role !== 'admin') {
      router.push('/login')
      return
    }
    const res = await fetch(`/api/cards/${id}`, { cache: 'no-store' })
    const data = await res.json()
    if (data.card) setForm(data.card)
    setLoading(false)
  }, [id, router])

  useEffect(() => { fetchCard() }, [fetchCard])

  const setField = (field: string, value: string | boolean | number) =>
    setForm((f) => ({ ...f, [field]: value }))

  const handlePhotoUpload = async (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => setCropSrc(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleCropComplete = async (blob: Blob) => {
    setCropSrc(null)
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', new File([blob], 'photo.jpg', { type: 'image/jpeg' }))
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) setField('photoUrl', data.url)
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/cards/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSaved(true)
        router.refresh()
        setTimeout(() => setSaved(false), 2000)
      }
    } finally {
      setSaving(false)
    }
  }

  if (cropSrc) {
    return (
      <ImageCropper
        imageSrc={cropSrc}
        onCancel={() => setCropSrc(null)}
        onCropComplete={handleCropComplete}
      />
    )
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ width: 24, height: 24, border: '2px solid #E0DCD7', borderTopColor: '#1A1A1A', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const textFields = ['name', 'title', 'company', 'phone', 'whatsapp', 'email', 'address', 'website',
    'instagram', 'twitter', 'linkedin', 'facebook', 'tiktok', 'youtube', 'mapLink', 'portfolio']

  return (
    <div style={{ minHeight: '100vh', background: '#F5F0EB', display: 'flex' }}>
      <AdminSidebar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }} className="admin-main">

        {/* Sticky header */}
        <div style={{
          padding: '16px 24px', borderBottom: '1px solid #E0DCD7',
          display: 'flex', alignItems: 'center', gap: 16,
          background: '#F5F0EB', position: 'sticky', top: 0, zIndex: 10,
        }}>
          <Link href="/admin/cards" style={{ color: '#6B6B6B', display: 'flex' }}>
            <ArrowLeft size={18} />
          </Link>
          <h1 style={{ fontSize: 18, fontWeight: 700, flex: 1, letterSpacing: '-0.01em' }}>
            Kartviziti Düzenle
          </h1>
          <button onClick={handleSave} disabled={saving} className="btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {saving ? 'Kaydediliyor...' : saved ? <><Check size={14} /> Kaydedildi</> : <><Save size={14} /> Kaydet</>}
          </button>
        </div>

        <div style={{ display: 'flex', flex: 1 }} className="split-layout">
          {/* Left: Form */}
          <div style={{ width: 460, overflowY: 'auto', maxHeight: 'calc(100vh - 61px)', padding: '24px 20px', borderRight: '1px solid #E0DCD7' }}>

            {/* Photo upload */}
            <div style={{ marginBottom: 20 }}>
              <label className="input-label">Fotoğraf</label>
              <div
                onClick={() => document.getElementById('photo-input-edit')?.click()}
                style={{
                  border: '2px dashed #E0DCD7', cursor: 'pointer',
                  minHeight: 120, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', position: 'relative', transition: 'border-color 0.2s',
                }}
                className="photo-drop"
              >
                {form.photoUrl ? (
                  <img src={form.photoUrl as string} alt="Önizleme"
                    style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                ) : (
                  <div style={{ textAlign: 'center', padding: 20 }}>
                    {uploading ? (
                      <span style={{ fontSize: 12, color: '#9B9B9B' }}>Yükleniyor...</span>
                    ) : (
                      <>
                        <Upload size={24} color="#9B9B9B" style={{ margin: '0 auto 8px' }} />
                        <div style={{ fontSize: 12, color: '#6B6B6B' }}>Fotoğraf yüklemek için tıkla</div>
                      </>
                    )}
                  </div>
                )}
              </div>
              <input
                id="photo-input-edit"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePhotoUpload(f) }}
              />
            </div>

            {/* Text fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {textFields.map((field) => (
                <div key={field}>
                  <label className="input-label">{FIELD_LABELS[field] || field}</label>
                  <input
                    className="input-field"
                    value={(form as Record<string, string>)[field] || ''}
                    onChange={(e) => setField(field, e.target.value)}
                  />
                </div>
              ))}

              <div>
                <label className="input-label">Tanıtım Yazısı</label>
                <textarea
                  className="input-field"
                  style={{ minHeight: 80, resize: 'vertical' }}
                  value={(form as Record<string, string>)['bio'] || ''}
                  onChange={(e) => setField('bio', e.target.value)}
                />
              </div>
            </div>

            {/* Card settings */}
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #E0DCD7' }}>
              <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B6B6B', marginBottom: 16 }}>
                Kart Ayarları
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>
                  <label className="input-label">Kategori</label>
                  <select className="input-field" style={{ appearance: 'none' }}
                    value={(form as Record<string, string>)['category'] || ''}
                    onChange={(e) => setField('category', e.target.value)}>
                    <option value="">Seçin</option>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="input-label">Paket</label>
                  <select className="input-field" style={{ appearance: 'none' }}
                    value={(form as Record<string, string>)['package'] || 'starter'}
                    onChange={(e) => setField('package', e.target.value)}>
                    {packages.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="input-label" style={{ marginBottom: 10 }}>Şablon</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {templates.map((tpl) => (
                    <button key={tpl.id} type="button"
                      onClick={() => setField('templateId', tpl.id)}
                      title={tpl.name}
                      style={{
                        width: 56, aspectRatio: '2/3', borderRadius: 6, overflow: 'hidden',
                        border: form.templateId === tpl.id ? '3px solid #1A1A1A' : '2px solid #E0DCD7',
                        cursor: 'pointer', transition: 'border-color 0.2s',
                        padding: 0, background: 'none',
                      }}
                    >
                      <MiniCardPreview tpl={tpl} />
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { field: 'canEdit', label: 'Düzenleme hakkı (Pro)' },
                  { field: 'canViewStats', label: 'İstatistik görme hakkı (Pro)' },
                ].map(({ field, label }) => (
                  <label key={field} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={Boolean((form as Record<string, boolean>)[field])}
                      onChange={(e) => setField(field, e.target.checked)}
                      style={{ width: 16, height: 16, accentColor: '#1A1A1A' }}
                    />
                    <span style={{ fontSize: 14, color: '#1A1A1A' }}>{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Live preview */}
          <div style={{ flex: 1, background: '#E8E4DF', display: 'flex', justifyContent: 'center', padding: 40, overflow: 'auto' }}>
            <div style={{ transform: 'scale(0.8)', transformOrigin: 'top center' }}>
              <CardTemplate card={form as CardData} />
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .admin-main { margin-left: 240px; }
        .photo-drop:hover { border-color: #1A1A1A !important; }
        @media (max-width: 1024px) {
          .admin-main { margin-left: 0 !important; }
          .split-layout { flex-direction: column !important; }
        }
      `}</style>
    </div>
  )
}
