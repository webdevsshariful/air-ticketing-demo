import Image from 'next/image'
import Link from 'next/link'
import SearchForm from '@/components/SearchForm'
import Reveal from '@/components/Reveal'
import HeroVisual from '@/components/HeroVisual'

const services = [
  {
    title: 'Search that feels premium',
    description: 'Dynamic search, route discovery, fare comparison, and filter interactions designed to feel fast and polished during the client presentation.',
  },
  {
    title: 'Checkout that tells the full story',
    description: 'Traveler capture, ancillaries, payment preference, confirmation, and booking retrieval all work together so the client sees the real product shape.',
  },
  {
    title: 'Operations workflow included',
    description: 'A ready back-office view shows booking status, service queue, revenue snapshot, and the kind of workflow the travel desk will use daily.',
  },
]

const highlights = [
  { value: '24/7', label: 'reservation support' },
  { value: '500+', label: 'airline options in full rollout' },
  { value: '6', label: 'client-ready pages' },
]

const featuredDestinations = [
  { city: 'Dubai', tag: 'Business and family travel', route: '/results?tripType=round-trip&from=DAC&to=DXB&departDate=2026-05-18&returnDate=2026-05-25&passengers=1&cabin=Economy' },
  { city: 'London', tag: 'Long-haul premium itineraries', route: '/results?tripType=round-trip&from=DAC&to=LHR&departDate=2026-05-18&returnDate=2026-05-27&passengers=1&cabin=Economy' },
  { city: 'Singapore', tag: 'Fast business routes', route: '/results?tripType=round-trip&from=DAC&to=SIN&departDate=2026-05-18&returnDate=2026-05-24&passengers=1&cabin=Economy' },
]

const tickerItems = ['Smart itinerary flow', 'Modern booking UX', 'Corporate travel ready', 'Post-booking servicing', 'Branded client presentation', 'Live API ready structure']

export default function HomePage() {
  return (
    <main>
      <section className="hero-section immersive-hero">
        <div className="hero-backdrop-glow hero-backdrop-left" />
        <div className="hero-backdrop-glow hero-backdrop-right" />
        <div className="container hero-grid hero-grid-updated">
          <Reveal className="hero-copy" delay={40}>
            <span className="eyebrow">WLS Air</span>
            <h1>Air booking that looks premium, moves beautifully, and explains the full business to your client.</h1>
            <p>
              Show a complete WLS Air experience with animated flight search, booking checkout, confirmation,
              booking retrieval, and admin operations in one polished presentation flow.
            </p>
            <div className="hero-actions">
              <Link href="/results?tripType=round-trip&from=DAC&to=DXB&departDate=2026-05-18&returnDate=2026-05-25&passengers=1&cabin=Economy" className="primary-button large-button magnetic-button">Explore Flights</Link>
              <Link href="/manage-booking" className="secondary-button large-button magnetic-button">Manage Booking</Link>
            </div>
            <div className="mini-stats animated-stats">
              {highlights.map((item, index) => (
                <Reveal key={item.label} className="stat-card glow-card" delay={120 + index * 90}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </Reveal>
              ))}
            </div>
          </Reveal>
          <Reveal delay={180}>
            <HeroVisual />
          </Reveal>
        </div>
        <div className="container hero-search-shell">
          <Reveal delay={220} className="floating-search-frame">
            <SearchForm />
          </Reveal>
        </div>
      </section>

      <section className="ticker-strip">
        <div className="ticker-track">
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="container">
          <Reveal className="section-heading" delay={40}>
            <span className="eyebrow">Platform flow</span>
            <h2>A full customer journey with motion, depth, and real presentation energy.</h2>
          </Reveal>
          <div className="feature-grid elevated-grid">
            {services.map((service, index) => (
              <Reveal key={service.title} className="feature-card interactive-card" delay={100 + index * 100}>
                <div className="feature-icon-wrap">0{index + 1}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block alt-section">
        <div className="container showcase-split-premium">
          <Reveal className="showcase-media tall-media-card" delay={60}>
            <div className="media-sheen" />
            <Image src="/brand/travel-campaign.jpg" alt="WLS Air campaign art" fill className="cover-image" />
          </Reveal>
          <Reveal className="showcase-copy-stack" delay={140}>
            <div className="showcase-card wide-card accent-card premium-card">
              <span className="eyebrow light">Why WLS Air</span>
              <h3>Built to make pricing conversations easier and the platform feel immediately premium.</h3>
              <p>
                The presentation flow now combines branded visuals from the WLS Air guide with layered motion,
                subtle parallax depth, and richer interactions across the public journey and operations view.
              </p>
              <div className="showcase-points">
                <span>Animated hero</span>
                <span>Scroll reveal sections</span>
                <span>Interactive result cards</span>
                <span>Brand-led visuals</span>
              </div>
            </div>
            <div className="dual-brand-grid">
              <div className="showcase-card dark-card premium-card">
                <span className="eyebrow light">Brand assets</span>
                <h3>Mother brand presence stays visible throughout the product story.</h3>
                <p>WLS Air stays clearly anchored to World Link Star while presenting a distinct travel-focused front end.</p>
              </div>
              <div className="showcase-media small-media-card">
                <Image src="/brand/stationery.jpg" alt="WLS Air stationery" fill className="cover-image" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-block">
        <div className="container">
          <Reveal className="section-heading" delay={40}>
            <span className="eyebrow">Popular routes</span>
            <h2>Open ready-made search flows and move directly into booking during the meeting.</h2>
          </Reveal>
          <div className="destination-grid">
            {featuredDestinations.map((destination, index) => (
              <Reveal key={destination.city} className="destination-card premium-destination-card" delay={90 + index * 90}>
                <span className="destination-tag">From Dhaka</span>
                <h3>{destination.city}</h3>
                <p>{destination.tag}</p>
                <Link href={destination.route} className="secondary-button magnetic-button">View Route</Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
