export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid #E0DCD7',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#F5F0EB',
      }}
    >
      <span style={{ fontSize: '12px', color: '#9B9B9B' }}>
        Created by{' '}
        <span style={{ fontWeight: 700, color: '#6B6B6B' }}>Satafi Software</span>
      </span>
      <span style={{ fontSize: '12px', color: '#9B9B9B' }}>
        © 2026 Nadar Sanal Kartvizit
      </span>
    </footer>
  )
}
