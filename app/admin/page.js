'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Reveal from '@/components/Reveal'
import { flights, seedBookings, supportQueue } from '@/lib/data'
import { bookingStorageKey, formatCurrency, formatDateTime, getFlightById, readBookings, writeBookings } from '@/lib/store'

export default function AdminPage() {
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    const live = readBookings()
    setBookings(live.length ? live : seedBookings)
  }, [])

  const metrics = useMemo(() => ({
    total: bookings.length,
    confirmed: bookings.filter((booking) => booking.status === 'Confirmed').length,
    pending: bookings.filter((booking) => booking.status !== 'Confirmed').length,
    revenue: bookings.reduce((sum, booking) => sum + booking.total, 0),
  }), [bookings])

  const resetWorkspace = () => {
    if (typeof window !== 'undefined') window.localStorage.removeItem(bookingStorageKey)
    setBookings(seedBookings)
  }

  const loadStarterData = () => {
    writeBookings(seedBookings)
    setBookings(seedBookings)
  }

  return (
    <main className="page-shell">
      <section className="page-hero compact-page-hero page-hero-rich">
        <div className="container page-hero-grid">
          <Reveal>
            <span className="eyebrow">Operations dashboard</span>
            <h1>Booking management and service queue</h1>
            <p>Review booking activity, traveler details, payment method, and service requests from one internal workspace.</p>
            <div className="admin-actions"><button type="button" className="secondary-button magnetic-button" onClick={loadStarterData}>Load starter data</button><button type="button" className="secondary-button magnetic-button" onClick={resetWorkspace}>Reset workspace</button></div>
          </Reveal>
          <Reveal className="page-hero-visual" delay={120}>
            <Image src="/brand/travel-campaign.jpg" alt="WLS Air operations visual" fill className="cover-image" />
          </Reveal>
        </div>
      </section>

      <section className="section-block no-top-padding">
        <div className="container">
          <div className="metrics-grid">
            <Reveal className="metric-card interactive-card" delay={60}><span>Total bookings</span><strong>{metrics.total}</strong></Reveal>
            <Reveal className="metric-card interactive-card" delay={120}><span>Confirmed</span><strong>{metrics.confirmed}</strong></Reveal>
            <Reveal className="metric-card interactive-card" delay={180}><span>Pending action</span><strong>{metrics.pending}</strong></Reveal>
            <Reveal className="metric-card interactive-card" delay={240}><span>Total revenue</span><strong>{formatCurrency(metrics.revenue)}</strong></Reveal>
          </div>

          <div className="admin-split">
            <Reveal className="admin-table-card" delay={120}>
              <div className="card-heading-row"><div><span className="eyebrow">Latest bookings</span><h2>Reservation overview</h2></div><Link href="/" className="primary-button magnetic-button">Start new booking</Link></div>
              <div className="table-scroll"><table className="booking-table"><thead><tr><th>Reference</th><th>Passenger</th><th>Route</th><th>Created</th><th>Status</th><th>Total</th></tr></thead><tbody>{bookings.map((booking) => { const flight = getFlightById(flights, booking.flightId); return <tr key={booking.reference}><td>{booking.reference}</td><td><div className="table-passenger"><strong>{booking.traveler.fullName}</strong><span>{booking.traveler.email}</span></div></td><td>{flight ? `${flight.from} to ${flight.to}` : 'N/A'}</td><td>{formatDateTime(booking.createdAt)}</td><td><span className={booking.status === 'Confirmed' ? 'status-pill green' : 'status-pill amber'}>{booking.status}</span></td><td>{formatCurrency(booking.total)}</td></tr> })}</tbody></table></div>
            </Reveal>

            <Reveal className="support-card glass-panel" delay={180}>
              <div className="card-heading-row"><div><span className="eyebrow">Service queue</span><h2>Open requests</h2></div></div>
              <div className="support-list">{supportQueue.map((item) => <div key={item.id} className="support-item interactive-card"><div><strong>{item.type}</strong><p>{item.reference}</p></div><span className={item.priority === 'High' ? 'status-pill amber' : 'status-pill green'}>{item.priority}</span></div>)}</div>
              <div className="summary-media-card admin-brand-media">
                <Image src="/brand/stationery.jpg" alt="WLS Air branded support visual" fill className="cover-image" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  )
}
