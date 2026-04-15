'use client'

import React from 'react'
import type { CardData } from './types'
import { PhoneIcon, MailIcon, MapPinIcon, WhatsAppIcon, InstagramIcon, FacebookIcon, TikTokIcon, BuildingIcon, LinkedInIcon, TwitterIcon } from './icons'

function getMapHref(card: CardData) {
  if (card.mapLink) return card.mapLink
  if (card.address) return `https://maps.google.com/?q=${encodeURIComponent(card.address)}`
  return '#'
}

function waHref(w?: string | null) {
  return `https://wa.me/${(w || '').replace(/[^0-9]/g, '')}`
}

export default function TemplateAbsurd({ card }: { card: CardData }) {
  const buttons = [
    card.phone && { icon: <PhoneIcon size={16} />, label: 'Tel', href: `tel:${card.phone}` },
    card.whatsapp && { icon: <WhatsAppIcon size={16} color="#000" />, label: 'WhatsApp', href: waHref(card.whatsapp) },
    card.email && { icon: <MailIcon size={16} />, label: 'E-posta', href: `mailto:${card.email}` },
    (card.mapLink || card.address) && { icon: <MapPinIcon size={16} />, label: 'Konum', href: getMapHref(card) },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; href: string }[]

  const socialIcons = [
    card.instagram && { icon: <InstagramIcon size={15} color="#000" />, href: card.instagram },
    card.facebook  && { icon: <FacebookIcon  size={15} color="#000" />, href: card.facebook },
    card.tiktok    && { icon: <TikTokIcon    size={15} color="#000" />, href: card.tiktok },
    card.linkedin  && { icon: <LinkedInIcon  size={15} color="#000" />, href: card.linkedin },
    card.twitter   && { icon: <TwitterIcon   size={15} color="#000" />, href: card.twitter },
    card.portfolio && { icon: <BuildingIcon  size={15} color="#000" />, href: card.portfolio },
  ].filter(Boolean) as { icon: React.ReactNode; href: string }[]

  return (
    <div style={{ background: '#FFFC00', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: "'Courier New', monospace" }}>
      <div style={{ maxWidth: 820, width: '100%', position: 'relative' }}>
        <div style={{ position: 'absolute', top: -10, left: -5, fontSize: 100, fontWeight: 900, color: 'rgba(0,0,0,0.04)', lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>
          EMLAK
        </div>

        <div style={{ border: '3px solid #000', background: '#fff' }}>
          {/* Top bar */}
          <div style={{ background: '#000', color: '#FFFC00', padding: '7px 14px', fontSize: 10, letterSpacing: '0.15em', display: 'flex', justifyContent: 'space-between' }}>
            <span>Sanal kartvizit</span>
            <span>#{String(Date.now()).slice(-4)}</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {/* Photo */}
            <div style={{ flex: '0 0 220px', height: 340, overflow: 'hidden', borderRight: '3px solid #000', position: 'relative' }} className="absurd-photo">
              {card.photoUrl ? (
                <img src={card.photoUrl} alt={card.name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.15) grayscale(100%)', display: 'block' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', background: '#ddd' }} />
              )}
              {card.title && (
                <div style={{ position: 'absolute', top: 14, left: -28, background: '#FFFC00', padding: '3px 36px', transform: 'rotate(-45deg)', fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', whiteSpace: 'nowrap' }}>
                  {card.title.split(' ')[0] || 'PRO'}
                </div>
              )}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 260, padding: 22 }}>
              <div style={{ fontSize: 8, letterSpacing: '0.2em', color: '#999', marginBottom: 3 }}>Ad / Soyad</div>
              <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0, lineHeight: 1 }}>{card.name}</h1>
              {(card.title || card.company) && (
                <div style={{ fontSize: 12, marginTop: 3, color: '#666' }}>
                  {[card.title, card.company].filter(Boolean).join(' — ')}
                </div>
              )}
              <div style={{ width: '100%', height: 3, background: '#000', margin: '14px 0' }} />
              {card.bio && (
                <p style={{ fontSize: 12, lineHeight: 1.7, color: '#444', borderLeft: '3px solid #FFFC00', paddingLeft: 10, margin: '0 0 18px 0' }}>{card.bio}</p>
              )}

              {/* 2x2 button grid */}
              {buttons.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                  {buttons.map((b, i) => (
                    <a key={i} href={b.href} target={b.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                      className="absurd-btn"
                      style={{ textDecoration: 'none', border: '2px solid #000', padding: '12px', display: 'flex', alignItems: 'center', gap: 8, margin: -1, color: '#000', background: '#fff', transition: 'all 0.15s' }}>
                      {b.icon}
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }}>{b.label}</span>
                    </a>
                  ))}
                </div>
              )}

              {/* Social icons */}
              {socialIcons.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', marginTop: 14 }}>
                  {socialIcons.map((s, i) => (
                    <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                      style={{ width: 38, height: 38, border: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: i ? -2 : 0, color: '#000', textDecoration: 'none' }}>
                      {s.icon}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 14, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em' }}>
          <a href="/" style={{ textDecoration: 'none', color: 'inherit', transition: 'opacity 0.2s', cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
            NADAR® SANAL KARTVIZIT
          </a>
        </div>
      </div>

      <style>{`
        .absurd-btn:hover { background: #000 !important; color: #FFFC00 !important; }
        .absurd-btn:hover svg { stroke: #FFFC00; }
        @media(max-width:480px){ .absurd-photo { flex: 0 0 100% !important; height: 220px !important; border-right: none !important; border-bottom: 3px solid #000; } }
      `}</style>
    </div>
  )
}
