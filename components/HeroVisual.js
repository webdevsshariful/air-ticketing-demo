'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'

const floatingStats = [
  { label: 'Search to book', value: '90 sec' },
  { label: 'Airline options', value: '500+' },
  { label: 'Service ready', value: '24/7' },
]

export default function HeroVisual() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const transforms = useMemo(() => {
    const primary = `perspective(1400px) rotateX(${tilt.x * 0.7}deg) rotateY(${tilt.y * 0.9}deg) translateY(-6px)`
    const secondary = `perspective(1400px) rotateX(${tilt.x * -0.25}deg) rotateY(${tilt.y * -0.35}deg) translateY(10px)`
    const tertiary = `perspective(1400px) rotateX(${tilt.x * -0.18}deg) rotateY(${tilt.y * 0.22}deg)`
    return { primary, secondary, tertiary }
  }, [tilt])

  const handleMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientY - rect.top) / rect.height - 0.5) * -18
    const y = ((event.clientX - rect.left) / rect.width - 0.5) * 18
    setTilt({ x, y })
  }

  const resetTilt = () => setTilt({ x: 0, y: 0 })

  return (
    <div className="hero-visual-shell" onMouseMove={handleMove} onMouseLeave={resetTilt}>
      <div className="hero-orb hero-orb-one" />
      <div className="hero-orb hero-orb-two" />
      <div className="hero-grid-lines" />
      <div className="hero-visual-stack">
        <div className="hero-main-card float-soft" style={{ transform: transforms.primary }}>
          <Image src="/brand/beach-campaign.jpg" alt="WLS Air destination campaign" fill className="cover-image" priority />
          <div className="hero-main-overlay">
            <span className="eyebrow light">Signature journeys</span>
            <strong>From inquiry to confirmed itinerary</strong>
          </div>
        </div>

        <div className="hero-side-card float-slower" style={{ transform: transforms.secondary }}>
          <Image src="/brand/travel-campaign.jpg" alt="WLS Air travel lifestyle campaign" fill className="cover-image" />
        </div>

        <div className="hero-mini-card" style={{ transform: transforms.tertiary }}>
          <Image src="/brand/stationery.jpg" alt="WLS Air branded stationery" fill className="cover-image" />
        </div>

        <div className="floating-chip chip-top">
          <span>Trusted brand layer</span>
          <strong>World Link Star</strong>
        </div>

        <div className="floating-chip chip-bottom">
          <span>Motion-first interface</span>
          <strong>Modern travel UX</strong>
        </div>

        <div className="floating-stats-panel glass-panel">
          {floatingStats.map((item) => (
            <div key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
