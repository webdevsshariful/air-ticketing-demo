'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import Reveal from '@/components/Reveal'
import { flights, seedBookings } from '@/lib/data'
import { formatCurrency, formatDateTime, formatDuration, getFlightById, readBookings } from '@/lib/store'

export default function ManageBookingPage() {
  const [reference, setReference] = useState('WLS-3TR9KP')
  const [email, setEmail] = useState('mahin@example.com')
  const [booking, setBooking] = useState(null)
  const [searched, setSearched] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    const stored = readBookings()
    const all = stored.length ? stored : seedBookings
    const found = all.find((item) => item.reference.toLowerCase() === reference.trim().toLowerCase() && item.traveler.email.toLowerCase() === email.trim().toLowerCase())
    setBooking(found || null)
    setSearched(true)
  }

  const flight = booking ? getFlightById(flights, booking.flightId) : null

  return (
    <main className="page-shell">
      <section className="page-hero compact-page-hero page-hero-rich">
        <div className="container page-hero-grid">
          <Reveal>
            <span className="eyebrow">Manage Booking</span>
            <h1>Find a reservation and review next actions.</h1>
            <p>Use a booking reference and traveler email to open the itinerary, view services, and discuss post-booking options.</p>
          </Reveal>
          <Reveal className="page-hero-visual hero-visual-short" delay={120}>
            <Image src="/brand/stationery.jpg" alt="WLS Air manage booking visual" fill className="cover-image" />
          </Reveal>
        </div>
      </section>

      <section className="section-block no-top-padding">
        <div className="container narrow-shell">
          <Reveal as="form" className="booking-form-card shimmer-card" onSubmit={handleSubmit}>
            <div className="card-heading-row"><div><span className="eyebrow">Reservation lookup</span><h2>Find booking</h2></div><span className="status-chip">Try WLS-3TR9KP / mahin@example.com</span></div>
            <div className="form-grid"><label className="field"><span>Booking reference</span><input value={reference} onChange={(event) => setReference(event.target.value)} placeholder="WLS-XXXXXX" required /></label><label className="field"><span>Traveler email</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" required /></label></div>
            <button type="submit" className="primary-button large-button magnetic-button">Retrieve Booking</button>
          </Reveal>

          {searched && booking && flight ? (
            <div className="manage-grid">
              <Reveal className="confirmation-card" delay={100}>
                <span className="eyebrow">Reservation details</span>
                <h2>{booking.reference}</h2>
                <div className="summary-list compact-summary-list"><div><span>Traveler</span><strong>{booking.traveler.fullName}</strong></div><div><span>Route</span><strong>{flight.fromCity} to {flight.toCity}</strong></div><div><span>Departure</span><strong>{formatDateTime(flight.departure)}</strong></div><div><span>Status</span><strong>{booking.status}</strong></div><div><span>Total</span><strong>{formatCurrency(booking.total)}</strong></div></div>
              </Reveal>

              <Reveal className="confirmation-card" delay={180}>
                <span className="eyebrow">Servicing options</span>
                <h2>Next available actions</h2>
                <div className="summary-list compact-summary-list"><div><span>Date change</span><strong>{booking.extras.flexibleTicket ? 'Eligible' : 'Request fee may apply'}</strong></div><div><span>Extra baggage</span><strong>{booking.extras.baggage ? 'Already added' : 'Can be added later'}</strong></div><div><span>Seat selection</span><strong>{booking.extras.seatSelection ? 'Reserved' : 'Available'}</strong></div><div><span>Support channel</span><strong>{booking.extras.prioritySupport ? 'Priority queue' : 'Standard queue'}</strong></div><div><span>Flight duration</span><strong>{formatDuration(flight.durationMinutes)}</strong></div></div>
                <div className="hero-actions less-top-space"><Link href="/admin" className="secondary-button magnetic-button">Send to Admin Queue</Link><Link href={`/confirmation?reference=${booking.reference}`} className="primary-button magnetic-button">Open Confirmation</Link></div>
              </Reveal>
            </div>
          ) : null}

          {searched && !booking ? <div className="empty-state"><h3>No booking matched those details.</h3><p>Check the reference and traveler email, or use the sample credentials shown above.</p></div> : null}
        </div>
      </section>
    </main>
  )
}
