'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Reveal from '@/components/Reveal'
import { flights } from '@/lib/data'
import { formatCurrency, formatDateTime, formatDuration, getFlightById, readBookings } from '@/lib/store'

export default function ConfirmationPage() {
  const searchParams = useSearchParams()
  const reference = searchParams.get('reference')
  const [booking, setBooking] = useState(null)

  useEffect(() => {
    const match = readBookings().find((item) => item.reference === reference)
    setBooking(match || null)
  }, [reference])

  const flight = useMemo(() => getFlightById(flights, booking?.flightId), [booking])

  if (!reference) return <main className="page-shell"><section className="section-block"><div className="container empty-state"><h1>Booking reference missing</h1><p>Please complete a booking from the checkout page to view confirmation details.</p></div></section></main>
  if (!booking || !flight) return <main className="page-shell"><section className="section-block"><div className="container empty-state"><h1>Loading booking confirmation...</h1><p>If you opened this page directly, create a booking first from the search results page.</p></div></section></main>

  const extras = [booking.extras.baggage && 'Extra baggage', booking.extras.seatSelection && 'Seat selection', booking.extras.flexibleTicket && 'Flexible date change', booking.extras.prioritySupport && 'Priority servicing'].filter(Boolean).join(', ') || 'No extra services selected'

  return (
    <main className="page-shell">
      <section className="section-block">
        <div className="container confirmation-layout">
          <Reveal className="confirmation-card success-card premium-card" delay={70}>
            <div className="success-icon">✓</div>
            <span className="eyebrow">Reservation complete</span>
            <h2>{booking.status === 'Confirmed' ? 'Your flight booking has been confirmed.' : 'Your reservation request has been received.'}</h2>
            <p>Your booking reference is <strong>{booking.reference}</strong>. Use it to manage the itinerary, request changes, or share the booking with the traveler.</p>
            <div className="confirmation-actions"><Link href="/manage-booking" className="primary-button magnetic-button">Manage Booking</Link><Link href="/admin" className="secondary-button magnetic-button">Open Admin</Link></div>
          </Reveal>

          <Reveal className="confirmation-card" delay={150}>
            <span className="eyebrow">Itinerary</span>
            <h2>{flight.fromCity} to {flight.toCity}</h2>
            <div className="summary-list compact-summary-list"><div><span>Airline</span><strong>{flight.airline}</strong></div><div><span>Flight</span><strong>{flight.flightNumber}</strong></div><div><span>Departure</span><strong>{formatDateTime(flight.departure)}</strong></div><div><span>Arrival</span><strong>{formatDateTime(flight.arrival)}</strong></div><div><span>Duration</span><strong>{formatDuration(flight.durationMinutes)}</strong></div><div><span>Total</span><strong>{formatCurrency(booking.total)}</strong></div></div>
          </Reveal>

          <Reveal className="confirmation-card confirmation-media-card" delay={220}>
            <div className="confirmation-media-shell">
              <Image src="/brand/beach-campaign.jpg" alt="WLS Air booking visual" fill className="cover-image" />
            </div>
            <div className="summary-list compact-summary-list"><div><span>Traveler</span><strong>{booking.traveler.fullName}</strong></div><div><span>Email</span><strong>{booking.traveler.email}</strong></div><div><span>Phone</span><strong>{booking.traveler.phone}</strong></div><div><span>Payment</span><strong>{booking.paymentMethod}</strong></div><div><span>Company</span><strong>{booking.companyName || 'Direct traveler'}</strong></div><div><span>Services</span><strong>{extras}</strong></div><div><span>Status</span><strong>{booking.status}</strong></div></div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
