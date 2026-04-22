'use client'

import { Suspense, useMemo, useState } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import SearchForm from '@/components/SearchForm'
import FlightCard from '@/components/FlightCard'
import Reveal from '@/components/Reveal'
import { airports, flights } from '@/lib/data'
import { formatCurrency, getAirportLabel } from '@/lib/store'

function ResultsPageContent() {
  const searchParams = useSearchParams()

  const from = searchParams.get('from') || ''
  const to = searchParams.get('to') || ''
  const tripType = searchParams.get('tripType') || 'round-trip'
  const cabin = searchParams.get('cabin') || ''
  const multiCityNote = searchParams.get('multiCityNote')

  const [selectedAirlines, setSelectedAirlines] = useState([])
  const [maxStops, setMaxStops] = useState('all')
  const [sortBy, setSortBy] = useState('best')
  const [maxPrice, setMaxPrice] = useState(1000)

  const routeFlights = useMemo(() => {
    if (!from || !to) return []

    return flights.filter((flight) => {
      const matchesRoute = flight.from === from && flight.to === to
      const matchesCabin = cabin ? (cabin === 'Economy' ? true : flight.cabin === cabin) : true
      return matchesRoute && matchesCabin
    })
  }, [from, to, cabin])

  const airlineOptions = Array.from(new Set(routeFlights.map((flight) => flight.airline)))

  const visibleFlights = useMemo(() => {
    const filtered = routeFlights.filter((flight) => {
      const airlineMatch = selectedAirlines.length === 0 || selectedAirlines.includes(flight.airline)
      const stopsMatch = maxStops === 'all' || flight.stops <= Number(maxStops)
      const priceMatch = flight.price <= maxPrice
      return airlineMatch && stopsMatch && priceMatch
    })

    return filtered.sort((first, second) => {
      if (sortBy === 'cheapest') return first.price - second.price
      if (sortBy === 'fastest') return first.durationMinutes - second.durationMinutes

      return (
        first.price +
        first.durationMinutes / 10 +
        first.stops * 45 -
        (second.price + second.durationMinutes / 10 + second.stops * 45)
      )
    })
  }, [routeFlights, selectedAirlines, maxStops, maxPrice, sortBy])

  const cheapestFare = visibleFlights.length ? Math.min(...visibleFlights.map((flight) => flight.price)) : null
  const fastestMinutes = visibleFlights.length ? Math.min(...visibleFlights.map((flight) => flight.durationMinutes)) : null

  const routeFromLabel = from ? getAirportLabel(airports, from) : 'Selected origin'
  const routeToLabel = to ? getAirportLabel(airports, to) : 'Selected destination'
  const displayCabin = cabin || 'Selected cabin'

  const toggleAirline = (airline) => {
    setSelectedAirlines((current) =>
      current.includes(airline) ? current.filter((item) => item !== airline) : [...current, airline]
    )
  }

  return (
    <main className="page-shell">
      <section className="page-hero compact-page-hero page-hero-rich">
        <div className="container page-hero-grid">
          <Reveal>
            <span className="eyebrow">Flight search</span>
            <h1>{from && to ? `${routeFromLabel} to ${routeToLabel}` : 'Flight Results'}</h1>
            <p>
              {tripType === 'multi-city'
                ? 'Multi-sector booking can be expanded with additional traveler and fare rules in the full build.'
                : 'Compare airlines, refine results, and continue to booking with one selected itinerary.'}
            </p>
            {multiCityNote ? <div className="info-banner">{multiCityNote}</div> : null}
          </Reveal>

          <Reveal className="page-hero-visual" delay={120}>
            <Image src="/brand/beach-campaign.jpg" alt="WLS Air route visual" fill className="cover-image" />
          </Reveal>
        </div>
      </section>

      <section className="section-block results-top-search">
        <div className="container">
          <Reveal delay={80}>
            <SearchForm compact />
          </Reveal>
        </div>
      </section>

      <section className="section-block no-top-padding">
        <div className="container results-layout">
          <Reveal as="aside" className="filters-panel" delay={90}>
            <div className="panel-block">
              <h3>Sort by</h3>
              <div className="pill-group">
                {['best', 'cheapest', 'fastest'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={sortBy === option ? 'filter-pill active' : 'filter-pill'}
                    onClick={() => setSortBy(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="panel-block">
              <h3>Stops</h3>
              <div className="stacked-options">
                {[
                  { value: 'all', label: 'Any' },
                  { value: '0', label: 'Non-stop only' },
                  { value: '1', label: 'Up to 1 stop' },
                ].map((option) => (
                  <label key={option.value} className="checkbox-row radio-row">
                    <input
                      type="radio"
                      name="stops"
                      checked={maxStops === option.value}
                      onChange={() => setMaxStops(option.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="panel-block">
              <h3>Airlines</h3>
              <div className="stacked-options">
                {airlineOptions.map((airline) => (
                  <label key={airline} className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={selectedAirlines.includes(airline)}
                      onChange={() => toggleAirline(airline)}
                    />
                    <span>{airline}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="panel-block">
              <div className="range-header">
                <h3>Max price</h3>
                <strong>{formatCurrency(maxPrice)}</strong>
              </div>
              <input
                className="range-input"
                type="range"
                min="250"
                max="1000"
                step="25"
                value={maxPrice}
                onChange={(event) => setMaxPrice(Number(event.target.value))}
              />
            </div>
          </Reveal>

          <div className="results-main">
            <Reveal className="results-summary-card glass-panel p-4" delay={120}>
              <div style={{ padding: '1rem' }}>
                <div>
                  <strong>{visibleFlights.length} flight options</strong>
                  <p>
                    {cheapestFare
                      ? `Best visible fare starts from ${formatCurrency(cheapestFare)}`
                      : 'No flights match the selected filters.'}
                  </p>
                </div>

                <div className="summary-tags">
                  <span className="summary-tag">{displayCabin}</span>
                  {fastestMinutes ? (
                    <span className="summary-tag">
                      Fastest {Math.floor(fastestMinutes / 60)}h {fastestMinutes % 60}m
                    </span>
                  ) : null}
                  <span className="summary-tag">Instant booking flow</span>
                </div>
              </div>
            </Reveal>

            <div className="insights-grid">
              <Reveal className="mini-card interactive-card" delay={150}>
                <span>Cheapest fare</span>
                <strong>{cheapestFare ? formatCurrency(cheapestFare) : 'N/A'}</strong>
              </Reveal>

              <Reveal className="mini-card interactive-card" delay={220}>
                <span>Airlines available</span>
                <strong>{airlineOptions.length}</strong>
              </Reveal>

              <Reveal className="mini-card interactive-card" delay={290}>
                <span>Most popular route style</span>
                <strong>{routeFlights.some((flight) => flight.stops === 0) ? 'Non-stop' : '1 stop'}</strong>
              </Reveal>
            </div>

            {visibleFlights.length ? (
              <div className="results-list">
                {visibleFlights.map((flight, index) => (
                  <Reveal key={flight.id} delay={110 + index * 70}>
                    <FlightCard flight={flight} />
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h3>No flights match the current filters.</h3>
                <p>Increase the price range or clear airline and stop filters to restore results.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<main className="page-shell"><section className="section-block"><div className="container">Loading results...</div></section></main>}>
      <ResultsPageContent />
    </Suspense>
  )
}