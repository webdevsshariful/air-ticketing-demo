'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Reveal from '@/components/Reveal'
import { flights } from '@/lib/data'
import { createReference, formatCurrency, formatDateTime, formatDuration, getFlightById, readBookings, writeBookings } from '@/lib/store'

const extraPrices = { baggage: 25, seatSelection: 15, flexibleTicket: 35, prioritySupport: 18 }

export default function BookingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const flight = getFlightById(flights, searchParams.get('flightId'))
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [nationality, setNationality] = useState('Bangladeshi')
  const [passportNumber, setPassportNumber] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('Card')
  const [baggage, setBaggage] = useState(true)
  const [seatSelection, setSeatSelection] = useState(true)
  const [flexibleTicket, setFlexibleTicket] = useState(false)
  const [prioritySupport, setPrioritySupport] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const total = useMemo(() => !flight ? 0 : flight.price + (baggage ? extraPrices.baggage : 0) + (seatSelection ? extraPrices.seatSelection : 0) + (flexibleTicket ? extraPrices.flexibleTicket : 0) + (prioritySupport ? extraPrices.prioritySupport : 0), [flight, baggage, seatSelection, flexibleTicket, prioritySupport])

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!flight) return
    setSubmitting(true)
    const reference = createReference()
    const booking = {
      reference,
      createdAt: new Date().toISOString(),
      status: paymentMethod === 'Bank Transfer' ? 'Pending Ticketing' : 'Confirmed',
      flightId: flight.id,
      total,
      paymentMethod,
      companyName,
      extras: { baggage, seatSelection, flexibleTicket, prioritySupport },
      traveler: { fullName, email, phone, nationality, passportNumber },
    }
    writeBookings([booking, ...readBookings()])
    router.push(`/confirmation?reference=${reference}`)
  }

  if (!flight) return <main className="page-shell"><section className="section-block"><div className="container empty-state"><h1>Flight not found</h1><p>Please return to the result page and choose a flight to continue.</p></div></section></main>

  return (
    <main className="page-shell">
      <section className="page-hero compact-page-hero page-hero-rich">
        <div className="container page-hero-grid">
          <Reveal>
            <span className="eyebrow">Checkout</span>
            <h1>Complete traveler details</h1>
            <p>Capture passenger information, choose service add-ons, and finish the booking flow with a branded confirmation.</p>
          </Reveal>
          <Reveal className="page-hero-visual hero-visual-short" delay={120}>
            <Image src="/brand/travel-campaign.jpg" alt="WLS Air traveler visual" fill className="cover-image" />
          </Reveal>
        </div>
      </section>

      <section className="section-block no-top-padding">
        <div className="container booking-layout">
          <Reveal as="form" className="booking-form-card shimmer-card" onSubmit={handleSubmit}>
            <div className="card-heading-row"><div><span className="eyebrow">Traveler information</span><h2>Primary passenger</h2></div><span className="status-chip">Secure reservation flow</span></div>
            <div className="form-grid">
              <label className="field"><span>Full name</span><input value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Enter traveler name" required /></label>
              <label className="field"><span>Email</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" required /></label>
              <label className="field"><span>Phone</span><input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+8801XXXXXXXXX" required /></label>
              <label className="field"><span>Nationality</span><input value={nationality} onChange={(event) => setNationality(event.target.value)} required /></label>
              <label className="field"><span>Passport number</span><input value={passportNumber} onChange={(event) => setPassportNumber(event.target.value)} placeholder="Passport or ID number" required /></label>
              <label className="field"><span>Company name</span><input value={companyName} onChange={(event) => setCompanyName(event.target.value)} placeholder="Optional corporate account" /></label>
            </div>
            <div className="extras-block"><h3>Travel extras</h3><div className="extras-list">
              <label className="extra-row interactive-card"><div><strong>Extra baggage</strong><p>Add more baggage allowance for the traveler.</p></div><div className="extra-action"><span>{formatCurrency(extraPrices.baggage)}</span><input type="checkbox" checked={baggage} onChange={() => setBaggage((value) => !value)} /></div></label>
              <label className="extra-row interactive-card"><div><strong>Seat selection</strong><p>Reserve a preferred seat in advance.</p></div><div className="extra-action"><span>{formatCurrency(extraPrices.seatSelection)}</span><input type="checkbox" checked={seatSelection} onChange={() => setSeatSelection((value) => !value)} /></div></label>
              <label className="extra-row interactive-card"><div><strong>Flexible date change</strong><p>Support easier date-change handling after ticketing.</p></div><div className="extra-action"><span>{formatCurrency(extraPrices.flexibleTicket)}</span><input type="checkbox" checked={flexibleTicket} onChange={() => setFlexibleTicket((value) => !value)} /></div></label>
              <label className="extra-row interactive-card"><div><strong>Priority servicing</strong><p>Queue the booking for faster support response.</p></div><div className="extra-action"><span>{formatCurrency(extraPrices.prioritySupport)}</span><input type="checkbox" checked={prioritySupport} onChange={() => setPrioritySupport((value) => !value)} /></div></label>
            </div></div>
            <div className="extras-block"><h3>Payment preference</h3><div className="payment-options">{['Card', 'Bank Transfer', 'Pay Later Request'].map((method) => <label key={method} className={paymentMethod === method ? 'payment-card active' : 'payment-card'}><input type="radio" name="paymentMethod" checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} /><span>{method}</span></label>)}</div></div>
            <button type="submit" className="primary-button large-button full-width-button magnetic-button" disabled={submitting}>{submitting ? 'Processing...' : 'Confirm Booking'}</button>
          </Reveal>

          <Reveal as="aside" className="booking-summary-card glass-panel" delay={120}>
            <div className="summary-headline"><div><span className="eyebrow">Selected flight</span><h3>{flight.airline}</h3><p>{flight.flightNumber} · {flight.cabin}</p></div></div>
            <div className="itinerary-summary-row"><div><strong>{flight.from}</strong><span>{formatDateTime(flight.departure)}</span></div><div className="summary-divider" /><div><strong>{flight.to}</strong><span>{formatDateTime(flight.arrival)}</span></div></div>
            <div className="summary-list"><div><span>Duration</span><strong>{formatDuration(flight.durationMinutes)}</strong></div><div><span>Stops</span><strong>{flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop`}</strong></div><div><span>Baggage rule</span><strong>{flight.baggage}</strong></div><div><span>Fare type</span><strong>{flight.refundable ? 'Refundable' : 'Restricted'}</strong></div></div>
            <div className="price-breakdown"><div><span>Base fare</span><strong>{formatCurrency(flight.price)}</strong></div><div><span>Extra baggage</span><strong>{baggage ? formatCurrency(extraPrices.baggage) : formatCurrency(0)}</strong></div><div><span>Seat selection</span><strong>{seatSelection ? formatCurrency(extraPrices.seatSelection) : formatCurrency(0)}</strong></div><div><span>Flexible date change</span><strong>{flexibleTicket ? formatCurrency(extraPrices.flexibleTicket) : formatCurrency(0)}</strong></div><div><span>Priority servicing</span><strong>{prioritySupport ? formatCurrency(extraPrices.prioritySupport) : formatCurrency(0)}</strong></div></div>
            <div className="grand-total"><span>Total amount</span><strong>{formatCurrency(total)}</strong></div>
            <div className="summary-media-card">
              <Image src="/brand/stationery.jpg" alt="WLS Air brand details" fill className="cover-image" />
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
