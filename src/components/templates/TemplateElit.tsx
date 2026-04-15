import React from 'react'
import type { CardData } from './types'
import { PhoneIcon, MailIcon, MapPinIcon, GlobeIcon, WhatsAppIcon, InstagramIcon, FacebookIcon, TikTokIcon, LinkedInIcon, TwitterIcon } from './icons'

const G = '#C9A84C'

function getMapHref(card: CardData) {
  if (card.mapLink) return card.mapLink
  if (card.address) return `https://maps.google.com/?q=${encodeURIComponent(card.address)}`
  return null
}

function waHref(w?: string | null) {
  return `https://wa.me/${(w || '').replace(/[^0-9]/g, '')}`
}

export default function TemplateElit({ card }: { card: CardData }) {
  const mapHref = getMapHref(card)
  const infoRows = [
    card.phone && { icon: <PhoneIcon size={13} color={G} sw={1.5} />, val: card.phone, href: `tel:${card.phone}` },
    card.email && { icon: <MailIcon size={13} color={G} sw={1.5} />, val: card.email, href: `mailto:${card.email}` },
    mapHref && { icon: <MapPinIcon size={13} color={G} sw={1.5} />, val: card.address || 'Konumu görüntüle', href: mapHref },
    card.website && { icon: <GlobeIcon size={13} color={G} sw={1.5} />, val: card.website, href: card.website.startsWith('http') ? card.website : `https://${card.website}` },
  ].filter(Boolean) as { icon: React.ReactNode; val: string; href: string }[]

  const socials = [
    card.instagram && { icon: <InstagramIcon size={15} color="#5E5A50" />, href: card.instagram },
    card.facebook  && { icon: <FacebookIcon  size={15} color="#5E5A50" />, href: card.facebook },
    card.tiktok    && { icon: <TikTokIcon    size={15} color="#5E5A50" />, href: card.tiktok },
    card.linkedin  && { icon: <LinkedInIcon  size={15} color="#5E5A50" />, href: card.linkedin },
    card.twitter   && { icon: <TwitterIcon   size={15} color="#5E5A50" />, href: card.twitter },
  ].filter(Boolean) as { icon: React.ReactNode; href: string }[]

  const corners = [
    { top: 0, left: 0, borderTopWidth: 1, borderLeftWidth: 1 },
    { top: 0, right: 0, borderTopWidth: 1, borderRightWidth: 1 },
    { bottom: 0, left: 0, borderBottomWidth: 1, borderLeftWidth: 1 },
    { bottom: 0, right: 0, borderBottomWidth: 1, borderRightWidth: 1 },
  ]

  return (
    <div style={{ background: '#0C0B09', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: "'Georgia', serif" }}>
      <div style={{ maxWidth: 740, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 9, letterSpacing: '0.4em', color: G, opacity: 0.5 }}>— Gayrimenkul Danışmanlığı —</div>
        </div>

        <div style={{ border: `1px solid ${G}30`, background: '#13120F', position: 'relative' }}>
          {/* Corner ornaments */}
          {corners.map((c, i) => (
            <div key={i} style={{ position: 'absolute', width: 20, height: 20, ...c, borderColor: G, borderStyle: 'solid', borderTopWidth: c.borderTopWidth || 0, borderRightWidth: c.borderRightWidth || 0, borderBottomWidth: c.borderBottomWidth || 0, borderLeftWidth: c.borderLeftWidth || 0, opacity: 0.35 }} />
          ))}

          <div style={{ padding: '44px 36px', display: 'flex', gap: 36, flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Photo */}
            <div style={{ flex: '0 0 170px' }}>
              <div style={{ border: `1px solid ${G}35`, padding: 3 }}>
                {card.photoUrl ? (
                  <img src={card.photoUrl} alt={card.name} style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block', filter: 'sepia(20%)' }} />
                ) : (
                  <div style={{ width: '100%', height: 220, background: '#2A2420', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56, color: G, fontWeight: 400 }}>
                    {card.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 240 }}>
              <h1 style={{ fontSize: 28, fontWeight: 400, color: '#F0ECE6', margin: 0, fontStyle: 'italic', lineHeight: 1.15 }}>{card.name}</h1>
              <div style={{ width: 40, height: 1, background: `linear-gradient(to right, ${G}, transparent)`, margin: '10px 0' }} />
              {card.title && <div style={{ fontSize: 11, color: G, letterSpacing: '0.15em' }}>{card.title}</div>}
              {card.company && <div style={{ fontSize: 11, color: '#5E5A50', marginTop: 3 }}>{card.company}</div>}
              {card.bio && <p style={{ fontSize: 13, color: '#8B8070', lineHeight: 1.7, marginTop: 14 }}>{card.bio}</p>}

              {/* Info rows */}
              {infoRows.length > 0 && (
                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {infoRows.map((r, i) => (
                    <a key={i} href={r.href} target={r.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                      style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, padding: '5px 0', borderBottom: '1px solid #1E1C18' }}>
                      {r.icon}
                      <span style={{ fontSize: 12, color: '#A09080' }}>{r.val}</span>
                    </a>
                  ))}
                </div>
              )}

              {/* CTA buttons */}
              <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                {card.whatsapp && (
                  <a href={waHref(card.whatsapp)} target="_blank" rel="noopener noreferrer"
                    style={{ textDecoration: 'none', background: G, color: '#0C0B09', padding: '9px 18px', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', fontFamily: 'sans-serif' }}>
                    WhatsApp
                  </a>
                )}
                {card.portfolio && (
                  <a href={card.portfolio} target="_blank" rel="noopener noreferrer"
                    style={{ textDecoration: 'none', border: `1px solid ${G}`, color: G, padding: '9px 18px', fontSize: 10, letterSpacing: '0.08em', fontFamily: 'sans-serif' }}>
                    Portföy
                  </a>
                )}
              </div>

              {socials.length > 0 && (
                <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
                  {socials.map((s, i) => (
                    <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" style={{ display: 'flex' }}>{s.icon}</a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 18, fontSize: 10, color: '#4A4538', letterSpacing: '0.15em' }}>
          <a href="/" style={{ textDecoration: 'none', color: 'inherit', transition: 'opacity 0.2s', cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
            <span style={{ fontWeight: 700, color: G }}>NADAR</span> Sanal Kartvizit®
          </a>
        </div>
      </div>
    </div>
  )
}
