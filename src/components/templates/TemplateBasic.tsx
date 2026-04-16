import React from 'react'
import type { CardData } from './types'
import {
  PhoneIcon, MailIcon, MapPinIcon, BuildingIcon,
  WhatsAppIcon, InstagramIcon, FacebookIcon, TikTokIcon, LinkedInIcon, TwitterIcon,
} from './icons'

function getMapHref(card: CardData) {
  if (card.mapLink) return card.mapLink
  if (card.address) return `https://maps.google.com/?q=${encodeURIComponent(card.address)}`
  return null
}

function waHref(w?: string | null) {
  return `https://wa.me/${(w || '').replace(/[^0-9]/g, '')}`
}

export default function TemplateBasic({ card }: { card: CardData }) {
  const mapHref = getMapHref(card)

  const contacts = [
    card.phone    && { icon: <PhoneIcon    size={22} color="#2C2C2C" />, label: 'Ara',          href: `tel:${card.phone}` },
    card.whatsapp && { icon: <WhatsAppIcon size={22} color="#2C2C2C" />, label: 'Mesaj at',     href: waHref(card.whatsapp) },
    card.email    && { icon: <MailIcon     size={22} color="#2C2C2C" />, label: 'Mail gönder',  href: `mailto:${card.email}` },
    mapHref       && { icon: <MapPinIcon   size={22} color="#2C2C2C" />, label: 'Konum',        href: mapHref },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; href: string }[]

  const socials = [
    card.instagram && { icon: <InstagramIcon size={22} color="#2C2C2C" />, href: card.instagram },
    card.facebook  && { icon: <FacebookIcon  size={22} color="#2C2C2C" />, href: card.facebook },
    card.tiktok    && { icon: <TikTokIcon    size={22} color="#2C2C2C" />, href: card.tiktok },
    card.linkedin  && { icon: <LinkedInIcon  size={22} color="#2C2C2C" />, href: card.linkedin },
    card.twitter   && { icon: <TwitterIcon   size={22} color="#2C2C2C" />, href: card.twitter },
  ].filter(Boolean) as { icon: React.ReactNode; href: string }[]

  return (
    <div style={{
      background: '#F5F0EB',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    }}>
      <div style={{ maxWidth: 820, width: '100%' }}>
        <div style={{ background: '#2C2C2C', borderRadius: 16, overflow: 'hidden' }}>

          {/* ── BİO — tam genişlik, en üstte ── */}
          {card.bio && (
            <div style={{ background: '#F5F0EB', padding: '22px 28px' }}>
              <p style={{ color: '#3A3A3A', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                {card.bio}
              </p>
            </div>
          )}

          {/* ── ALT: fotoğraf + isim / iletişim butonları ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '200px 1fr',
            borderTop: card.bio ? '1px solid #3A3A3A' : 'none',
          }} className="basic-body">

            {/* Sol: fotoğraf + isim */}
            <div style={{ borderRight: '1px solid #3A3A3A', display: 'flex', flexDirection: 'column' }}>
              {card.photoUrl ? (
                <img
                  src={card.photoUrl}
                  alt={card.name}
                  style={{ width: '100%', height: 240, objectFit: 'cover', display: 'block', flexShrink: 0 }}
                />
              ) : (
                <div style={{
                  width: '100%', height: 240,
                  background: '#3A3A3A',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 64, fontWeight: 700, color: '#555', flexShrink: 0,
                }}>
                  {card.name.charAt(0)}
                </div>
              )}
              <div style={{ padding: '18px 20px', flex: 1 }}>
                <div style={{ color: '#F0ECE6', fontSize: 18, fontWeight: 600, letterSpacing: -0.3, lineHeight: 1.2 }}>
                  {card.name}
                </div>
                {card.title   && <div style={{ color: '#A09A92', fontSize: 13, marginTop: 4 }}>{card.title}</div>}
                {card.company && <div style={{ color: '#6E6A63', fontSize: 12, marginTop: 2 }}>{card.company}</div>}
              </div>
            </div>

            {/* Sağ: butonlar + sosyal / portföy */}
            <div style={{ padding: '24px 22px', display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* 4 iletişim butonu */}
              {contacts.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                  {contacts.map((b, i) => (
                    <a
                      key={i}
                      href={b.href}
                      target={b.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
                    >
                      <div style={{
                        width: 56, height: 56,
                        background: '#F5F0EB', borderRadius: 10,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {b.icon}
                      </div>
                      <span style={{ color: '#9B9590', fontSize: 11, letterSpacing: '0.02em' }}>{b.label}</span>
                    </a>
                  ))}
                </div>
              )}

              {/* Sosyal medya + portföy */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {socials.length > 0 && (
                  <div style={{
                    flex: 1, minWidth: 130,
                    background: '#F5F0EB', borderRadius: 10,
                    padding: '14px 16px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                  }}>
                    <div style={{ display: 'flex', gap: 14 }}>
                      {socials.map((s, i) => (
                        <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', color: '#2C2C2C' }}>
                          {s.icon}
                        </a>
                      ))}
                    </div>
                    <span style={{ fontSize: 10, color: '#9B9590' }}>Sosyal medya</span>
                  </div>
                )}
                {card.portfolio && (
                  <a
                    href={card.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1, minWidth: 130,
                      background: '#F5F0EB', borderRadius: 10,
                      padding: '14px 16px',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
                      textDecoration: 'none',
                    }}
                  >
                    <BuildingIcon size={24} color="#2C2C2C" />
                    <span style={{ fontSize: 10, color: '#9B9590' }}>Portföyümü inceleyin</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Nadar branding */}
        <div style={{ textAlign: 'center', marginTop: 18, fontSize: 12, color: '#A09A92' }}>
          <a href="/" className="nadar-brand-link" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
            <span style={{ fontWeight: 700, color: '#6E6A63' }}>Nadar</span> Sanal Kartvizit®
          </a>
        </div>
      </div>

      <style>{`
        @media(max-width:600px){
          .basic-body { grid-template-columns: 1fr !important; }
          .basic-body > div:first-child { border-right: none !important; border-bottom: 1px solid #3A3A3A; }
        }
      `}</style>
    </div>
  )
}
