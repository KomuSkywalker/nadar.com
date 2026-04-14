import React from 'react'
import type { CardData } from './types'
import { PhoneIcon, MailIcon, MapPinIcon, WhatsAppIcon, InstagramIcon, FacebookIcon, TikTokIcon } from './icons'

const ACCENT = '#E8E2D9'

function getMapHref(card: CardData) {
  if (card.mapLink) return card.mapLink
  if (card.address) return `https://maps.google.com/?q=${encodeURIComponent(card.address)}`
  return null
}

function waHref(w?: string | null) {
  return `https://wa.me/${(w || '').replace(/[^0-9]/g, '')}`
}

export default function TemplateFelix({ card }: { card: CardData }) {
  const mapHref = getMapHref(card)
  const infoRows = [
    card.phone && { icon: <PhoneIcon size={14} color={ACCENT} sw={1.5} />, label: 'Telefon', val: card.phone, href: `tel:${card.phone}` },
    card.email && { icon: <MailIcon size={14} color={ACCENT} sw={1.5} />, label: 'E-posta', val: card.email, href: `mailto:${card.email}` },
    mapHref && { icon: <MapPinIcon size={14} color={ACCENT} sw={1.5} />, label: 'Adres', val: card.address || 'Konuma git', href: mapHref },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; val: string; href: string }[]

  const socials = [
    card.instagram && { icon: <InstagramIcon size={16} color="#666" />, href: card.instagram },
    card.facebook && { icon: <FacebookIcon size={16} color="#666" />, href: card.facebook },
    card.tiktok && { icon: <TikTokIcon size={16} color="#666" />, href: card.tiktok },
  ].filter(Boolean) as { icon: React.ReactNode; href: string }[]

  return (
    <div style={{ background: '#F5F0EB', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: "'Helvetica Neue', sans-serif" }}>
      <div style={{ maxWidth: 800, width: '100%' }}>
        <div style={{ display: 'flex', minHeight: 460, flexWrap: 'wrap', overflow: 'hidden', borderRadius: 4 }} className="felix-card">

          {/* Thin accent strip */}
          <div style={{ flex: '0 0 50px', background: ACCENT, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px 0' }} className="felix-strip">
            <div style={{ writingMode: 'vertical-rl', fontSize: 9, letterSpacing: '0.3em', color: '#1A1A1A', opacity: 0.4 }}>Nadar Kartvizit</div>
          </div>

          {/* Photo */}
          <div style={{ flex: '0 0 220px', position: 'relative', overflow: 'hidden' }} className="felix-photo">
            {card.photoUrl ? (
              <img src={card.photoUrl} alt={card.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: '#C8C0B4', minHeight: 460 }} />
            )}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.75))', padding: '28px 18px 14px' }}>
              <div style={{ fontSize: 17, fontWeight: 600, color: '#fff' }}>{card.name}</div>
              {card.title && <div style={{ fontSize: 11, color: '#ccc', marginTop: 2 }}>{card.title}</div>}
            </div>
          </div>

          {/* Content panel */}
          <div style={{ flex: 1, minWidth: 240, background: '#1A1A1A', padding: 28, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              {card.company && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 20, height: 2, background: ACCENT }} />
                  <span style={{ fontSize: 10, letterSpacing: '0.2em', color: '#666' }}>{card.company}</span>
                </div>
              )}
              {card.bio && <p style={{ fontSize: 13, color: '#A0A0A0', lineHeight: 1.7, margin: 0 }}>{card.bio}</p>}
            </div>

            <div>
              {/* Info rows */}
              {infoRows.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 20 }}>
                  {infoRows.map((r, i) => (
                    <a key={i} href={r.href} target={r.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                      style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #262626' }}>
                      <div style={{ width: 32, height: 32, background: '#262626', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, flexShrink: 0 }}>
                        {r.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: 9, color: '#555', letterSpacing: '0.08em' }}>{r.label}</div>
                        <div style={{ fontSize: 12, color: '#ccc', marginTop: 1 }}>{r.val}</div>
                      </div>
                    </a>
                  ))}
                </div>
              )}

              {/* CTA buttons */}
              <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
                {card.whatsapp && (
                  <a href={waHref(card.whatsapp)} target="_blank" rel="noopener noreferrer"
                    style={{ textDecoration: 'none', flex: 1, background: ACCENT, color: '#1A1A1A', padding: '10px', textAlign: 'center', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', borderRadius: 3 }}>
                    WhatsApp
                  </a>
                )}
                {card.portfolio && (
                  <a href={card.portfolio} target="_blank" rel="noopener noreferrer"
                    style={{ textDecoration: 'none', flex: 1, border: '1px solid #333', color: '#888', padding: '10px', textAlign: 'center', fontSize: 11, letterSpacing: '0.06em', borderRadius: 3 }}>
                    Portföy
                  </a>
                )}
              </div>

              {socials.length > 0 && (
                <div style={{ marginTop: 14, display: 'flex', gap: 12 }}>
                  {socials.map((s, i) => (
                    <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" style={{ display: 'flex' }}>{s.icon}</a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right', marginTop: 12, fontSize: 11, color: '#9B9B9B' }}>
          <span style={{ fontWeight: 600 }}>Nadar</span> Sanal Kartvizit®
        </div>
      </div>

      <style>{`
        @media(max-width:640px){
          .felix-card { flex-direction: column !important; }
          .felix-strip { flex: 0 0 40px !important; flex-direction: row !important; width: 100%; }
          .felix-photo { flex: 0 0 220px !important; width: 100%; }
        }
      `}</style>
    </div>
  )
}
