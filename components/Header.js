'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Home' },
  { href: '/results?tripType=round-trip&from=DAC&to=DXB&departDate=2026-05-18&returnDate=2026-05-25&passengers=1&cabin=Economy', label: 'Flights' },
  { href: '/manage-booking', label: 'Manage Booking' },
  { href: '/admin', label: 'Admin' }
]

export default function Header() {
  const pathname = usePathname()
  return (
    <header className="site-header">
      <div className="container navbar">
        <Link href="/" className="brand-lockup">
          <Image src="/wls-logo.png" alt="WLS Air" width={150} height={72} priority />
        </Link>
        <nav className="nav-links">
          {links.map((link) => {
            const active = pathname === link.href || (link.href.startsWith('/results') && pathname === '/results')
            return <Link key={link.label} href={link.href} className={active ? 'nav-link active' : 'nav-link'}>{link.label}</Link>
          })}
        </nav>
        <Link href="/results?tripType=round-trip&from=DAC&to=DXB&departDate=2026-05-18&returnDate=2026-05-25&passengers=1&cabin=Economy" className="primary-button nav-cta">Search Flights</Link>
      </div>
    </header>
  )
}
