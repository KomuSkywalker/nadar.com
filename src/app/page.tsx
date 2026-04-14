import Link from 'next/link'
import Footer from '@/components/layout/Footer'
import { packages } from '@/lib/packages'
import { Link2, RefreshCw, BarChart3, Palette } from 'lucide-react'

const features = [
  {
    icon: Link2,
    title: 'Tek Link',
    desc: 'Bir link ile tüm iletişim bilgilerinizi paylaşın.',
  },
  {
    icon: RefreshCw,
    title: 'Anında Güncelleme',
    desc: 'Bilgileriniz değişti mi? Kartınızı güncelleyin, herkes yeni bilgiye ulaşsın.',
  },
  {
    icon: BarChart3,
    title: 'İstatistik',
    desc: 'Kartınız kaç kez görüntülendi? Detaylı analitik ile takip edin.',
  },
  {
    icon: Palette,
    title: 'Profesyonel Şablonlar',
    desc: '5 farklı şablon arasından sektörünüze uygun olanı seçin.',
  },
]

const templatePreviews = [
  {
    name: 'Klasik',
    gradient: 'linear-gradient(135deg, #0f0c29 0%, #1a1040 50%, #24243e 100%)',
    accent: '#e94560',
    tag: 'En Popüler',
  },
  {
    name: 'Modern',
    gradient: 'linear-gradient(135deg, #1a0533 0%, #2d1b4e 50%, #0d1b3e 100%)',
    accent: '#00d2ff',
    tag: 'Teknoloji',
  },
  {
    name: 'Elegant',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    accent: '#f5af19',
    tag: 'Premium',
  },
  {
    name: 'Doğal',
    gradient: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    accent: '#7ecac3',
    tag: 'Minimal',
  },
]

export default function LandingPage() {
  return (
    <div style={{ background: '#F5F0EB', minHeight: '100vh' }}>

      {/* Hero Banner — header yok, direkt banner */}
      <section
        style={{
          minHeight: '70vh',
          background: '#1A1A1A',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '80px 24px',
          position: 'relative',
        }}
      >
        {/* NADAR branding in banner */}
        <div style={{ marginBottom: '40px' }}>
          <div
            style={{
              fontSize: '13px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)',
              marginBottom: '8px',
              fontWeight: 400,
            }}
          >
            Nadar — Sanal Kartvizit
          </div>
        </div>

        <h1
          style={{
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            marginBottom: '24px',
            maxWidth: '640px',
          }}
        >
          Dijital kartvizitinizi
          <br />
          bugün oluşturun.
        </h1>

        <p
          style={{
            fontSize: '14px',
            letterSpacing: '0.08em',
            color: 'rgba(255,255,255,0.55)',
            marginBottom: '48px',
            fontWeight: 400,
          }}
        >
          Profesyonel. Paylaşılabilir. Her zaman güncel.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/order"
            style={{
              background: '#FFFFFF',
              color: '#1A1A1A',
              padding: '16px 48px',
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              display: 'inline-block',
              textDecoration: 'none',
              transition: 'background 0.3s ease',
            }}
          >
            Hemen Başlayın
          </Link>
          <Link
            href="/login"
            style={{
              background: 'transparent',
              color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '16px 48px',
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              display: 'inline-block',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
            }}
          >
            Giriş Yap
          </Link>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '48px' }}>
          <h2
            style={{
              fontSize: '22px',
              fontWeight: 700,
              color: '#1A1A1A',
              letterSpacing: '-0.01em',
            }}
          >
            Neden Nadar?
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
          }}
          className="features-grid"
        >
          {features.map((f, i) => (
            <div
              key={f.title}
              style={{
                padding: '40px 32px',
                borderTop: '1px solid #E0DCD7',
                borderBottom: '1px solid #E0DCD7',
                borderLeft: '1px solid #E0DCD7',
                borderRight: i === features.length - 1 ? '1px solid #E0DCD7' : 'none',
              }}
            >
              <f.icon
                size={28}
                style={{ color: '#1A1A1A', marginBottom: '20px', strokeWidth: 1.5 }}
              />
              <h3
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  marginBottom: '10px',
                  color: '#1A1A1A',
                }}
              >
                {f.title}
              </h3>
              <p style={{ fontSize: '14px', color: '#6B6B6B', lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        <style>{`
          @media (max-width: 768px) {
            .features-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
            .features-grid > div {
              border-right: 1px solid #E0DCD7 !important;
            }
          }
          @media (max-width: 480px) {
            .features-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>

      {/* Template Previews */}
      <section
        style={{
          padding: '80px 24px',
          borderTop: '1px solid #E0DCD7',
          background: '#FFFFFF',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '48px' }}>
            <h2
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: '#1A1A1A',
                letterSpacing: '-0.01em',
              }}
            >
              Kartvizitinize karar verin
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '24px',
            }}
            className="templates-grid"
          >
            {templatePreviews.map((tpl) => (
              <div key={tpl.name} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    aspectRatio: '3/4',
                    background: tpl.gradient,
                    borderRadius: '16px',
                    marginBottom: '12px',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'pointer',
                    boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.06)`,
                  }}
                  className="template-card"
                >
                  {/* Tag badge */}
                  <div style={{
                    position: 'absolute', top: 14, right: 14,
                    background: `${tpl.accent}22`,
                    border: `1px solid ${tpl.accent}55`,
                    borderRadius: 4, padding: '3px 8px',
                    fontSize: 9, color: tpl.accent, fontWeight: 600,
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                  }}>
                    {tpl.tag}
                  </div>

                  {/* Subtle pattern overlay */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: `radial-gradient(circle at 70% 20%, ${tpl.accent}12 0%, transparent 60%)`,
                  }} />

                  {/* Card content */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    padding: '28px 20px',
                    gap: 0,
                  }}>
                    {/* Avatar */}
                    <div style={{
                      width: 52, height: 52, borderRadius: '50%',
                      border: `2px solid ${tpl.accent}`,
                      background: `linear-gradient(135deg, ${tpl.accent}33, ${tpl.accent}11)`,
                      marginBottom: 14,
                      boxShadow: `0 0 0 4px ${tpl.accent}18`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {/* face silhouette */}
                      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                        <circle cx="13" cy="10" r="5" fill={tpl.accent} opacity="0.7"/>
                        <path d="M4 22c0-5 4-8 9-8s9 3 9 8" stroke={tpl.accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
                      </svg>
                    </div>

                    {/* Name */}
                    <div style={{
                      width: '75%', height: 9,
                      background: 'rgba(255,255,255,0.85)',
                      borderRadius: 5, marginBottom: 7,
                    }} />
                    {/* Title */}
                    <div style={{
                      width: '55%', height: 6,
                      background: 'rgba(255,255,255,0.4)',
                      borderRadius: 3, marginBottom: 5,
                    }} />
                    {/* Accent underline */}
                    <div style={{
                      width: '40%', height: 2,
                      background: tpl.accent,
                      borderRadius: 1, marginBottom: 18,
                      boxShadow: `0 0 6px ${tpl.accent}88`,
                    }} />

                    {/* Divider */}
                    <div style={{
                      width: '85%', height: 1,
                      background: 'rgba(255,255,255,0.08)',
                      marginBottom: 14,
                    }} />

                    {/* Contact rows */}
                    {[0.35, 0.25, 0.28].map((w, i) => (
                      <div key={i} style={{
                        width: '80%', display: 'flex',
                        alignItems: 'center', gap: 7,
                        marginBottom: i < 2 ? 8 : 0,
                      }}>
                        <div style={{
                          width: 7, height: 7, borderRadius: '50%',
                          background: `${tpl.accent}88`, flexShrink: 0,
                        }} />
                        <div style={{
                          flex: 1, height: 5,
                          background: 'rgba(255,255,255,0.2)',
                          borderRadius: 3,
                          width: `${w * 100}%`,
                        }} />
                      </div>
                    ))}
                  </div>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#1A1A1A', letterSpacing: '0.02em' }}>
                  {tpl.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          .template-card:hover { transform: translateY(-4px) scale(1.01); box-shadow: 0 16px 48px rgba(0,0,0,0.4) !important; }
          @media (max-width: 768px) {
            .templates-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
        `}</style>
      </section>

      {/* Packages */}
      <section
        style={{
          padding: '80px 24px',
          borderTop: '1px solid #E0DCD7',
          background: '#F5F0EB',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '48px' }}>
            <h2
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: '#1A1A1A',
                letterSpacing: '-0.01em',
              }}
            >
              Size uygun paketi seçin
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '24px',
              maxWidth: '800px',
            }}
            className="packages-grid"
          >
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E0DCD7',
                  borderLeft: pkg.recommended ? '3px solid #1A1A1A' : '1px solid #E0DCD7',
                  padding: '40px',
                }}
              >
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    letterSpacing: '-0.01em',
                    marginBottom: '4px',
                    color: '#1A1A1A',
                  }}
                >
                  {pkg.name}
                </div>

                <div style={{ marginBottom: '4px' }}>
                  <span style={{ fontSize: '36px', fontWeight: 700, color: '#1A1A1A' }}>
                    ₺{pkg.price}
                  </span>
                </div>

                <div style={{ fontSize: '12px', color: '#9B9B9B', marginBottom: '28px' }}>
                  Tek seferlik
                </div>

                <ul style={{ listStyle: 'none', marginBottom: '32px' }}>
                  {pkg.features.map((f) => (
                    <li
                      key={f}
                      style={{
                        fontSize: '14px',
                        color: '#1A1A1A',
                        padding: '5px 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <span style={{ color: '#6B6B6B' }}>—</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/order?package=${pkg.id}`}
                  className="btn-primary"
                  style={{ display: 'block', textAlign: 'center' }}
                >
                  Seç
                </Link>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .packages-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* Bottom CTA */}
      <section
        style={{
          padding: '80px 24px',
          borderTop: '1px solid #E0DCD7',
          background: '#FFFFFF',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontSize: '28px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            marginBottom: '40px',
            color: '#1A1A1A',
          }}
        >
          Hazırsanız başlayalım
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <Link href="/order" className="btn-primary" style={{ minWidth: '200px' }}>
            Satın Al
          </Link>
          <Link href="/login" className="btn-secondary" style={{ minWidth: '200px' }}>
            Giriş Yap
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
