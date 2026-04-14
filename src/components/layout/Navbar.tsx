'use client'

import Link from 'next/link'

interface NavbarProps {
  showLogin?: boolean
  bg?: 'cream' | 'dark' | 'transparent'
}

export default function Navbar({ showLogin = true, bg = 'cream' }: NavbarProps) {
  const bgClass =
    bg === 'dark'
      ? 'bg-[#1A1A1A] border-white/10'
      : bg === 'transparent'
      ? 'bg-transparent border-transparent'
      : 'bg-[#F5F0EB] border-[#E0DCD7]'

  const textClass = bg === 'dark' ? 'text-white' : 'text-[#1A1A1A]'
  const subTextClass = bg === 'dark' ? 'text-white/40' : 'text-[#6B6B6B]'
  const btnBorder = bg === 'dark' ? 'border-white/30 text-white hover:bg-white hover:text-[#1A1A1A]' : 'border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white'

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b ${bgClass}`}
      style={{ backdropFilter: 'blur(0px)' }}
    >
      <Link href="/" className="flex flex-col">
        <span
          className={`text-2xl font-bold tracking-tight leading-none uppercase ${textClass}`}
          style={{ letterSpacing: '-0.02em' }}
        >
          NADAR
        </span>
        <span
          className={`text-[10px] font-normal uppercase tracking-widest ${subTextClass}`}
          style={{ letterSpacing: '0.1em' }}
        >
          Sanal Kartvizit
        </span>
      </Link>

      {showLogin && (
        <Link
          href="/login"
          className={`px-6 py-2 border text-[13px] font-medium tracking-widest uppercase transition-all ${btnBorder}`}
          style={{ letterSpacing: '0.08em' }}
        >
          Giriş Yap
        </Link>
      )}
    </nav>
  )
}
