import Link from 'next/link'
import { formatCurrency, formatDuration, formatTime } from '@/lib/store'

export default function FlightCard({ flight }) {
  return (
    <article className="flight-card interactive-card shimmer-card">
      <div className="flight-top-row">
        <div className="airline-block">
          <div className="airline-logo">{flight.airline.slice(0, 2).toUpperCase()}</div>
          <div>
            <strong>{flight.airline}</strong>
            <p>{flight.flightNumber} · {flight.cabin}</p>
          </div>
        </div>
        {flight.badge ? <span className="badge-pill">{flight.badge}</span> : <span className="badge-pill subtle">Available</span>}
      </div>
      <div className="flight-mid-row">
        <div className="time-block"><strong>{formatTime(flight.departure)}</strong><span>{flight.from}</span><p>{flight.fromCity}</p></div>
        <div className="route-block"><span>{formatDuration(flight.durationMinutes)}</span><div className="route-line" /><p>{flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop`}</p></div>
        <div className="time-block align-right"><strong>{formatTime(flight.arrival)}</strong><span>{flight.to}</span><p>{flight.toCity}</p></div>
      </div>
      <div className="flight-bottom-row">
        <div className="flight-meta"><span>{flight.refundable ? 'Refundable fare' : 'Restricted fare'}</span><span>{flight.baggage}</span></div>
        <div className="price-block"><p>Total fare from</p><strong>{formatCurrency(flight.price)}</strong><Link href={`/booking?flightId=${flight.id}`} className="primary-button magnetic-button">Select Flight</Link></div>
      </div>
    </article>
  )
}
