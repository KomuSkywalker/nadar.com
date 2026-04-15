'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminSidebar from '@/components/layout/AdminSidebar'
import { templates } from '@/lib/templates'
import { categories } from '@/lib/categories'
import { packages } from '@/lib/packages'
import { ArrowLeft, Check, Copy, ExternalLink, Upload, X } from 'lucide-react'
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

interface CreatedResult {
  card: { id: string }
  user: { username: string; rawPassword: string } | null
  cardUrl: string
}

export default function NewCardPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    title: '',
    company: '',
    phone: '',
    email: '',
    address: '',
    website: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    facebook: '',
    tiktok: '',
    youtube: '',
    whatsapp: '',
    templateId: '1',
    category: '',
    package: 'starter',
    status: 'active',
    createUser: true,
    bio: '',
    photoUrl: '',
    mapLink: '',
    portfolio: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CreatedResult | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [cropSrc, setCropSrc] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/auth/me').then((r) => {
      if (!r.ok) router.push('/login')
    })
  }, [router])

  const set = (field: string, value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value }))

  const handlePhotoUpload = useCallback(async (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => setCropSrc(e.target?.result as string)
    reader.readAsDataURL(file)
  }, [])

  const handleCropComplete = useCallback(async (blob: Blob) => {
    setCropSrc(null)
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', new File([blob], 'photo.jpg', { type: 'image/jpeg' }))
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) set('photoUrl', data.url)
    } finally {
      setUploading(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) handlePhotoUpload(file)
  }, [handlePhotoUpload])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, templateId: Number(form.templateId) }),
      })
      const data = await res.json()
      if (res.ok) setResult(data)
    } finally {
      setLoading(false)
    }
  }

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
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

  if (result) {
    return (
      <div style={{ minHeight: '100vh', background: '#F5F0EB', display: 'flex' }}>
        <AdminSidebar />
        <main
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 32px',
          }}
          className="admin-main"
        >
          <div style={{ maxWidth: '480px', width: '100%' }}>
            <div
              style={{
                width: '48px',
                height: '1px',
                background: '#1A1A1A',
                marginBottom: '32px',
              }}
            />
            <h1
              style={{
                fontSize: '24px',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: '#1A1A1A',
                marginBottom: '8px',
              }}
            >
              Kartvizit oluşturuldu
            </h1>
            <p style={{ fontSize: '14px', color: '#6B6B6B', marginBottom: '32px' }}>
              Müşteriye aşağıdaki bilgileri iletin.
            </p>

            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #E0DCD7',
                padding: '24px',
                marginBottom: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              {[
                {
                  label: 'Kartvizit Linki',
                  value: `${window.location.origin}/card/${result.card.id}`,
                  key: 'link',
                },
                ...(result.user
                  ? [
                      { label: 'Kullanıcı Adı', value: result.user.username, key: 'username' },
                      { label: 'Giriş Şifresi', value: result.user.rawPassword, key: 'password' },
                    ]
                  : []),
              ].map((item) => (
                <div key={item.key}>
                  <div
                    style={{
                      fontSize: '11px',
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
                      gap: '10px',
                      background: '#F5F0EB',
                      padding: '10px 14px',
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
                      onClick={() => copyText(item.value, item.key)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#6B6B6B',
                        flexShrink: 0,
                        padding: '2px',
                      }}
                    >
                      {copied === item.key ? (
                        <Check size={14} style={{ color: '#065F46' }} />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Link
                href={`/card/${result.card.id}`}
                target="_blank"
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '12px',
                  border: '1px solid #E0DCD7',
                  color: '#1A1A1A',
                  textDecoration: 'none',
                  fontSize: '13px',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                <ExternalLink size={13} />
                Görüntüle
              </Link>
              <Link
                href="/admin/cards"
                className="btn-primary"
                style={{ flex: 1, textAlign: 'center', padding: '12px' }}
              >
                Tüm Kartlar
              </Link>
            </div>
          </div>
        </main>
        <style>{`.admin-main { margin-left: 240px; } @media (max-width: 1024px) { .admin-main { margin-left: 0 !important; padding-bottom: 80px !important; } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F0EB', display: 'flex' }}>
      <AdminSidebar />

      <main style={{ flex: 1, padding: '40px 32px' }} className="admin-main">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <Link
            href="/admin/cards"
            style={{
              display: 'flex',
              color: '#6B6B6B',
              transition: 'color 0.15s',
            }}
          >
            <ArrowLeft size={18} />
          </Link>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#1A1A1A',
            }}
          >
            Yeni Kartvizit
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: '24px' }}
        >
          {/* Basic Info */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E0DCD7', padding: '28px' }}>
            <div
              style={{
                fontSize: '11px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#6B6B6B',
                marginBottom: '20px',
              }}
            >
              Kişisel Bilgiler
            </div>
            <div
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}
              className="form-grid"
            >
              {[
                { field: 'name', label: 'Ad Soyad *', req: true, placeholder: 'Ad Soyad' },
                { field: 'title', label: 'Ünvan', req: false, placeholder: 'Danışman' },
                { field: 'company', label: 'Şirket', req: false, placeholder: 'Şirket' },
                { field: 'phone', label: 'Telefon', req: false, placeholder: '+90 5xx xxx xx xx' },
                { field: 'email', label: 'E-posta', req: false, placeholder: 'email@ornek.com' },
                { field: 'website', label: 'Website', req: false, placeholder: 'www.site.com' },
                { field: 'address', label: 'Adres', req: false, placeholder: 'Şehir, İlçe' },
                { field: 'whatsapp', label: 'WhatsApp', req: false, placeholder: '+90 5xx xxx xx xx' },
                { field: 'mapLink', label: 'Harita Linki', req: false, placeholder: 'Google Maps URL' },
                { field: 'portfolio', label: 'Portföy Linki', req: false, placeholder: 'Portföy URL' },
              ].map(({ field, label, req, placeholder }) => (
                <div key={field}>
                  <label className="input-label">{label}</label>
                  <input
                    className="input-field"
                    required={req}
                    value={(form as unknown as Record<string, string>)[field] || ''}
                    onChange={(e) => set(field, e.target.value)}
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Medya ve Tanıtım */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E0DCD7', padding: '28px' }}>
            <div
              style={{
                fontSize: '11px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#6B6B6B',
                marginBottom: '20px',
              }}
            >
              Medya ve Tanıtım
            </div>
            
            <div style={{ marginBottom: '20px' }}>
                <label className="input-label" style={{ marginBottom: 8 }}>Fotoğraf</label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('photo-input')?.click()}
                  style={{
                    border: `2px dashed ${dragOver ? '#1A1A1A' : '#E0DCD7'}`,
                    background: dragOver ? '#F0EBE4' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    minHeight: 120,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  {form.photoUrl ? (
                    <>
                      <img
                        src={form.photoUrl as string}
                        alt="Fotoğraf önizleme"
                        style={{ height: 160, objectFit: 'contain', display: 'block', padding: '10px' }}
                      />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); set('photoUrl', '') }}
                        style={{
                          position: 'absolute', top: 8, right: 8,
                          background: '#1A1A1A', border: 'none', borderRadius: '50%',
                          width: 28, height: 28, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                        }}
                      >
                        <X size={14} />
                      </button>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: 20 }}>
                      {uploading ? (
                        <span style={{ fontSize: 12, color: '#9B9B9B' }}>Yükleniyor...</span>
                      ) : (
                        <>
                          <Upload size={24} color="#9B9B9B" style={{ margin: '0 auto 8px' }} />
                          <div style={{ fontSize: 12, color: '#6B6B6B', fontWeight: 500 }}>Fotoğraf sürükleyin</div>
                          <div style={{ fontSize: 11, color: '#9B9B9B', marginTop: 3 }}>veya tıklayın</div>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <input
                  id="photo-input"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePhotoUpload(f) }}
                />
            </div>

            <div>
              <label className="input-label">Tanıtım Yazısı</label>
              <textarea
                className="input-field"
                style={{ minHeight: 80, resize: 'vertical' }}
                value={(form.bio as string) || ''}
                onChange={(e) => set('bio', e.target.value)}
                placeholder="Kendinizi kısaca tanıtın..."
              />
            </div>
          </div>

          {/* Social */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E0DCD7', padding: '28px' }}>
            <div
              style={{
                fontSize: '11px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#6B6B6B',
                marginBottom: '20px',
              }}
            >
              Sosyal Medya
            </div>
            <div
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}
              className="form-grid"
            >
              {[
                { field: 'instagram', label: 'Instagram', placeholder: '@kullanici' },
                { field: 'twitter', label: 'Twitter/X', placeholder: '@kullanici' },
                { field: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/...' },
                { field: 'facebook', label: 'Facebook', placeholder: 'fb.com/...' },
                { field: 'tiktok', label: 'TikTok', placeholder: '@kullanici' },
                { field: 'youtube', label: 'YouTube', placeholder: '@kanal' },
              ].map(({ field, label, placeholder }) => (
                <div key={field}>
                  <label className="input-label">{label}</label>
                  <input
                    className="input-field"
                    value={(form as unknown as Record<string, string>)[field] || ''}
                    onChange={(e) => set(field, e.target.value)}
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E0DCD7', padding: '28px' }}>
            <div
              style={{
                fontSize: '11px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#6B6B6B',
                marginBottom: '20px',
              }}
            >
              Kart Ayarları
            </div>
            <div
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}
              className="form-grid"
            >
              <div>
                <label className="input-label">Kategori</label>
                <select
                  className="input-field"
                  value={form.category}
                  onChange={(e) => set('category', e.target.value)}
                  style={{ appearance: 'none' }}
                >
                  <option value="">Seçin</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="input-label">Paket</label>
                <select
                  className="input-field"
                  value={form.package}
                  onChange={(e) => set('package', e.target.value)}
                  style={{ appearance: 'none' }}
                >
                  {packages.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="input-label" style={{ marginBottom: '12px' }}>Şablon</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {templates.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => set('templateId', String(tpl.id))}
                    title={tpl.name}
                    style={{
                      width: '64px',
                      aspectRatio: '2/3',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      border:
                        form.templateId === String(tpl.id)
                          ? '3px solid #1A1A1A'
                          : '2px solid #E0DCD7',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s',
                      padding: 0,
                      background: 'none',
                    }}
                  >
                    <MiniCardPreview tpl={tpl} />
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input
                type="checkbox"
                id="createUser"
                checked={form.createUser}
                onChange={(e) => set('createUser', e.target.checked)}
                style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#1A1A1A' }}
              />
              <label
                htmlFor="createUser"
                style={{ fontSize: '14px', color: '#1A1A1A', cursor: 'pointer' }}
              >
                Müşteri hesabı da oluştur
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Oluşturuluyor...' : 'Kartvizit Oluştur'}
          </button>
        </form>
      </main>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .admin-main { margin-left: 240px; }
        @media (max-width: 1024px) {
          .admin-main { margin-left: 0 !important; padding-bottom: 80px !important; }
        }
        @media (max-width: 768px) {
          .admin-main { padding: 24px 16px !important; }
          .form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
