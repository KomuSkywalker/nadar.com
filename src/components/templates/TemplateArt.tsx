import React from 'react'
import type { CardData } from './types'
import { PhoneIcon, MailIcon, MapPinIcon, WhatsAppIcon, InstagramIcon, FacebookIcon, TikTokIcon, LinkedInIcon, TwitterIcon } from './icons'

function getMapHref(card: CardData) {
  if (card.mapLink) return card.mapLink
  if (card.address) return `https://maps.google.com/?q=${encodeURIComponent(card.address)}`
  return '#'
}

function waHref(w?: string | null) {
  return `https://wa.me/${(w || '').replace(/[^0-9]/g, '')}`
}

export default function TemplateArt({ card }: { card: CardData }) {
  const socials = [
    card.instagram && { icon: <InstagramIcon size={17} color="#8B7D6B" />, href: card.instagram },
    card.facebook  && { icon: <FacebookIcon  size={17} color="#8B7D6B" />, href: card.facebook },
    card.tiktok    && { icon: <TikTokIcon    size={17} color="#8B7D6B" />, href: card.tiktok },
    card.linkedin  && { icon: <LinkedInIcon  size={17} color="#8B7D6B" />, href: card.linkedin },
    card.twitter   && { icon: <TwitterIcon   size={17} color="#8B7D6B" />, href: card.twitter },
  ].filter(Boolean) as { icon: React.ReactNode; href: string }[]

  const buttons = [
    card.phone && { icon: <PhoneIcon size={16} color="#8B7D6B" sw={1.5} />, label: 'Ara', href: `tel:${card.phone}` },
    card.email && { icon: <MailIcon size={16} color="#8B7D6B" sw={1.5} />, label: 'E-posta', href: `mailto:${card.email}` },
    card.whatsapp && { icon: <WhatsAppIcon size={16} color="#8B7D6B" />, label: 'WhatsApp', href: waHref(card.whatsapp) },
    (card.mapLink || card.address) && { icon: <MapPinIcon size={16} color="#8B7D6B" sw={1.5} />, label: 'Konum', href: getMapHref(card) },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; href: string }[]

  return (
    <div style={{ background: '#E8E2D9', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: "'Georgia', serif" }}>
      <div style={{ maxWidth: 860, width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 520, overflow: 'hidden', borderRadius: 4 }} className="art-grid">

          {/* Left: photo */}
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            {card.photoUrl ? (
              <img src={card.photoUrl} alt={card.name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(25%) contrast(1.05)', display: 'block' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: '#C4BAA8', minHeight: 520 }} />
            )}
            {card.company && (
              <div style={{ position: 'absolute', bottom: 20, left: 20 }}>
                <span style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#fff', opacity: 0.8, background: 'rgba(0,0,0,0.3)', padding: '4px 10px' }}>{card.company}</span>
              </div>
            )}
          </div>

          {/* Right: dark panel */}
          <div style={{ background: '#1C1915', padding: '40px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#8B7D6B', marginBottom: 14 }}>
                {card.title || 'Kartvizit'}
              </div>
              <h1 style={{ fontSize: 32, fontWeight: 400, color: '#F0ECE6', lineHeight: 1.1, margin: 0, fontStyle: 'italic' }}>{card.name}</h1>
              <div style={{ width: 36, height: 1, background: '#8B7D6B', margin: '14px 0' }} />
              {card.title && <div style={{ fontSize: 13, color: '#8B7D6B', letterSpacing: '0.06em' }}>{card.title}</div>}
              {card.bio && <p style={{ fontSize: 14, color: '#A09080', lineHeight: 1.75, marginTop: 20 }}>{card.bio}</p>}
            </div>

            <div>
              {/* 2x2 contact grid */}
              {buttons.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: '#2A261F', marginTop: 20 }}>
                  {buttons.map((b, i) => (
                    <a key={i} href={b.href} target={b.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                      style={{ textDecoration: 'none', background: '#1C1915', padding: '14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                      {b.icon}
                      <span style={{ fontSize: 11, color: '#A09080' }}>{b.label}</span>
                    </a>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18 }}>
                {socials.length > 0 && (
                  <div style={{ display: 'flex', gap: 14 }}>
                    {socials.map((s, i) => (
                      <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" style={{ display: 'flex' }}>{s.icon}</a>
                    ))}
                  </div>
                )}
                {card.portfolio && (
                  <a href={card.portfolio} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 10, color: '#8B7D6B', textDecoration: 'none', letterSpacing: '0.06em', borderBottom: '1px solid #8B7D6B' }}>
                    Portföy
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 18, fontSize: 11, color: '#A09080', letterSpacing: '0.08em' }}>
          <a href="/" style={{ textDecoration: 'none', color: 'inherit', transition: 'opacity 0.2s', cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
            <span style={{ fontWeight: 700 }}>Nadar</span> Sanal Kartvizit®
          </a>
        </div>
      </div>
      <style>{`@media(max-width:640px){.art-grid{grid-template-columns:1fr !important;}}`}</style>
    </div>
  )
}
