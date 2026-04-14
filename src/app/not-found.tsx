import Link from 'next/link'

export default function NotFound() {
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
            fontSize: '96px',
            fontWeight: 700,
            letterSpacing: '-0.04em',
            color: '#1A1A1A',
            lineHeight: 1,
            marginBottom: '24px',
          }}
        >
          404
        </div>
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#1A1A1A',
            marginBottom: '12px',
          }}
        >
          Sayfa bulunamadı
        </h1>
        <p
          style={{
            fontSize: '15px',
            color: '#6B6B6B',
            marginBottom: '40px',
          }}
        >
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
        <Link href="/" className="btn-secondary">
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  )
}
