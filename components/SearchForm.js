'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { airports } from '@/lib/data'

const tripTypeOptions = [
  ['round-trip', 'Round Trip'],
  ['one-way', 'One Way'],
  ['multi-city', 'Multi City'],
]

const passengerOptions = [
  { value: '1', label: '1 Traveler' },
  { value: '2', label: '2 Travelers' },
  { value: '3', label: '3 Travelers' },
  { value: '4', label: '4 Travelers' },
]

const cabinOptions = [
  { value: 'Economy', label: 'Economy' },
  { value: 'Premium Economy', label: 'Premium Economy' },
  { value: 'Business', label: 'Business' },
]

const weekdayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function toIsoDate(date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatDisplayDate(value) {
  if (!value) return ''
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${value}T12:00:00`))
}

function formatMonthLabel(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function addMonths(date, amount) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1)
}

function getCalendarDays(viewDate, minDate) {
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const startOffset = firstDay.getDay()
  const gridStart = new Date(year, month, 1 - startOffset)

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart)
    date.setDate(gridStart.getDate() + index)
    const iso = toIsoDate(date)

    return {
      iso,
      day: date.getDate(),
      isCurrentMonth: date.getMonth() === month,
      isDisabled: minDate ? iso < minDate : false,
    }
  })
}

function useFloatingPosition(isOpen, triggerRef, offset = 12) {
  const [position, setPosition] = useState(null)

  useEffect(() => {
    if (!isOpen || !triggerRef.current) return

    const updatePosition = () => {
      const rect = triggerRef.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom + offset,
        left: rect.left,
        width: rect.width,
      })
    }

    updatePosition()

    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isOpen, triggerRef, offset])

  return position
}

function Portal({ children }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) return null
  return createPortal(children, document.body)
}

function CustomSelect({ label, value, onChange, placeholder, options, disabled = false, wide = false }) {
  const containerRef = useRef(null)
  const triggerRef = useRef(null)
  const panelRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const position = useFloatingPosition(isOpen, triggerRef)
  const selectedOption = options.find((option) => option.value === value)

  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target

      if (containerRef.current?.contains(target)) return
      if (panelRef.current?.contains(target)) return

      setIsOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={wide ? 'field-card field-card-span-2' : 'field-card'} ref={containerRef}>
      <span className="field-label">{label}</span>

      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        className={isOpen ? 'control-shell custom-trigger open' : 'control-shell custom-trigger'}
        onClick={() => !disabled && setIsOpen((current) => !current)}
      >
        <span className={value ? 'custom-trigger-value has-value' : 'custom-trigger-value'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className={isOpen ? 'control-arrow open' : 'control-arrow'}>▾</span>
      </button>

      {isOpen && position ? (
        <Portal>
          <div
            ref={panelRef}
            className="floating-panel floating-select-panel"
            style={{
              top: position.top,
              left: position.left,
              width: position.width,
            }}
          >
            <div className="floating-list">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={option.value === value ? 'floating-option active' : 'floating-option'}
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                  }}
                >
                  <span>{option.label}</span>
                  {option.value === value ? <span className="option-check">✓</span> : null}
                </button>
              ))}
            </div>
          </div>
        </Portal>
      ) : null}
    </div>
  )
}

function DatePickerField({ label, value, onChange, placeholder, minDate }) {
  const containerRef = useRef(null)
  const triggerRef = useRef(null)
  const panelRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [viewDate, setViewDate] = useState(() => {
    if (value) return new Date(`${value}T12:00:00`)
    if (minDate) return new Date(`${minDate}T12:00:00`)
    return new Date()
  })
  const position = useFloatingPosition(isOpen, triggerRef)

  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target

      if (containerRef.current?.contains(target)) return
      if (panelRef.current?.contains(target)) return

      setIsOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    if (value) {
      setViewDate(new Date(`${value}T12:00:00`))
      return
    }
    if (minDate) {
      setViewDate(new Date(`${minDate}T12:00:00`))
      return
    }
    setViewDate(new Date())
  }, [isOpen, value, minDate])

  const days = useMemo(() => getCalendarDays(viewDate, minDate), [viewDate, minDate])

  return (
    <div className="field-card date-field-card" ref={containerRef}>
      <span className="field-label">{label}</span>

      <button
        ref={triggerRef}
        type="button"
        className={isOpen ? 'control-shell date-trigger open' : 'control-shell date-trigger'}
        onClick={() => setIsOpen((current) => !current)}
      >
        <div className="date-trigger-copy">
          <span className={value ? 'date-value has-value' : 'date-value'}>
            {value ? formatDisplayDate(value) : placeholder}
          </span>
          <span className="date-meta">{value ? 'Selected date' : 'Tap to choose date'}</span>
        </div>
        <span className="calendar-badge">📅</span>
      </button>

      {isOpen && position ? (
        <Portal>
          <div
            ref={panelRef}
            className="floating-panel date-popover"
            style={{
              top: position.top,
              left: position.left,
              width: Math.max(position.width, 320),
            }}
          >
            <div className="date-popover-header">
              <button
                type="button"
                className="calendar-nav"
                onClick={() => setViewDate((current) => addMonths(current, -1))}
              >
                ‹
              </button>

              <strong>{formatMonthLabel(viewDate)}</strong>

              <button
                type="button"
                className="calendar-nav"
                onClick={() => setViewDate((current) => addMonths(current, 1))}
              >
                ›
              </button>
            </div>

            <div className="calendar-weekdays">
              {weekdayLabels.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>

            <div className="calendar-grid">
              {days.map((day) => (
                <button
                  key={day.iso}
                  type="button"
                  disabled={day.isDisabled}
                  className={[
                    'calendar-day',
                    day.isCurrentMonth ? '' : 'muted',
                    value === day.iso ? 'selected' : '',
                  ]
                    .join(' ')
                    .trim()}
                  onClick={() => {
                    onChange(day.iso)
                    setIsOpen(false)
                  }}
                >
                  {day.day}
                </button>
              ))}
            </div>
          </div>
        </Portal>
      ) : null}
    </div>
  )
}

export default function SearchForm({ compact = false }) {
  const router = useRouter()
  const timeoutRef = useRef(null)

  const [tripType, setTripType] = useState('round-trip')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [departDate, setDepartDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [passengers, setPassengers] = useState('')
  const [cabin, setCabin] = useState('')
  const [error, setError] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const destinationChoices = useMemo(() => {
    if (!from) return airports
    return airports.filter((airport) => airport.code !== from)
  }, [from])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (departDate && returnDate && returnDate < departDate) {
      setReturnDate('')
    }
  }, [departDate, returnDate])

  const handleTripTypeChange = (value) => {
    setTripType(value)
    if (value !== 'round-trip') setReturnDate('')
    setError('')
  }

  const handleFromChange = (value) => {
    setFrom(value)
    if (value && value === to) setTo('')
    setError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const hasRequiredFields =
      from &&
      to &&
      departDate &&
      passengers &&
      cabin &&
      (tripType !== 'round-trip' || returnDate)

    if (!hasRequiredFields) {
      setError('Please complete all required fields before searching flights.')
      return
    }

    setError('')
    setIsSearching(true)

    const params = new URLSearchParams({
      tripType,
      from,
      to,
      departDate,
      passengers,
      cabin,
    })

    if (tripType === 'round-trip' && returnDate) {
      params.set('returnDate', returnDate)
    }

    if (tripType === 'multi-city') {
      params.set(
        'multiCityNote',
        'Multi-city routing can expand into full sector-based itinerary management in the production build.'
      )
    }

    timeoutRef.current = window.setTimeout(() => {
      router.push(`/results?${params.toString()}`)
    }, 5000)
  }

  return (
    <>
      <form
        className={compact ? 'search-shell search-shell-updated compact' : 'search-shell search-shell-updated'}
        onSubmit={handleSubmit}
        aria-busy={isSearching}
      >
        <div className="trip-tabs trip-tabs-updated">
          {tripTypeOptions.map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={tripType === value ? 'trip-tab active' : 'trip-tab'}
              onClick={() => handleTripTypeChange(value)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="search-grid search-grid-updated">
          <CustomSelect
            label="From"
            value={from}
            onChange={handleFromChange}
            placeholder="Select departure airport"
            options={airports.map((airport) => ({
              value: airport.code,
              label: airport.label,
            }))}
            wide
          />

          <CustomSelect
            label="To"
            value={to}
            onChange={setTo}
            placeholder="Select destination airport"
            options={destinationChoices.map((airport) => ({
              value: airport.code,
              label: airport.label,
            }))}
            wide
          />

          <DatePickerField
            label="Departure"
            value={departDate}
            onChange={setDepartDate}
            placeholder="Choose departure date"
          />

          {tripType === 'round-trip' ? (
            <DatePickerField
              label="Return"
              value={returnDate}
              onChange={setReturnDate}
              placeholder="Choose return date"
              minDate={departDate || undefined}
            />
          ) : (
            <label className="field-card">
              <span className="field-label">{tripType === 'multi-city' ? 'Routing' : 'Trip Type'}</span>
              <div className="control-shell fake-shell">
                <div className="fake-value">
                  {tripType === 'multi-city' ? 'Add multiple sectors in next step' : 'Single journey selected'}
                </div>
              </div>
            </label>
          )}

          <CustomSelect
            label="Travelers"
            value={passengers}
            onChange={setPassengers}
            placeholder="Select travelers"
            options={passengerOptions}
          />

          <CustomSelect
            label="Cabin"
            value={cabin}
            onChange={setCabin}
            placeholder="Select cabin class"
            options={cabinOptions}
          />
        </div>

        {error ? <div className="search-error">{error}</div> : null}

        <div className="search-footer search-footer-updated">
          <p className="search-note">
            Choose route, dates, passengers, and cabin class to search available flights.
          </p>
          <button
            type="submit"
            className="primary-button large-button search-cta-button"
            disabled={isSearching}
          >
            {isSearching ? 'Searching Flights...' : 'Search Flights'}
          </button>
        </div>

        {isSearching ? (
          <div className="search-loading-overlay">
            <div className="search-loading-card">
              <div className="loading-badge">WLS Air</div>
              <h3>Searching live fares</h3>
              <p>Checking routes, schedules, pricing, and cabin availability for your selection.</p>

              <div className="loading-progress">
                <span />
              </div>

              <div className="loading-steps">
                <div className="loading-step active">Checking route availability</div>
                <div className="loading-step active">Comparing airline prices</div>
                <div className="loading-step active">Preparing booking options</div>
              </div>
            </div>
          </div>
        ) : null}
      </form>

      <style jsx global>{`
        .search-shell-updated {
          position: relative;
          padding: 32px;
          border-radius: 32px;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(247, 249, 252, 0.96)),
            radial-gradient(circle at top left, rgba(238, 29, 70, 0.08), transparent 35%);
          border: 1px solid rgba(17, 35, 62, 0.08);
          box-shadow:
            0 24px 60px rgba(17, 35, 62, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          overflow: visible;
        }

        .search-shell-updated.compact {
          padding: 28px;
        }

        .trip-tabs-updated {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          margin-bottom: 28px;
          border-radius: 999px;
          background: #eef2f7;
          box-shadow: inset 0 1px 2px rgba(17, 35, 62, 0.06);
        }

        .trip-tab {
          min-width: 112px;
          height: 48px;
          padding: 0 20px;
          border: 0;
          border-radius: 999px;
          background: transparent;
          color: #64748b;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 180ms ease;
        }

        .trip-tab:hover {
          color: #11233e;
        }

        .trip-tab.active {
          background: #ffffff;
          color: #11233e;
          box-shadow: 0 10px 24px rgba(17, 35, 62, 0.12);
        }

        .search-grid-updated {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
          align-items: end;
        }

        .field-card {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .field-card-span-2 {
          grid-column: span 2;
        }

        .field-label {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #6b7280;
        }

        .control-shell {
          position: relative;
          height: 68px;
          display: flex;
          align-items: center;
          padding: 0 18px;
          border-radius: 22px;
          background: #ffffff;
          border: 1px solid #e6ebf2;
          box-shadow: 0 14px 30px rgba(15, 23, 42, 0.06);
          transition:
            border-color 180ms ease,
            box-shadow 180ms ease,
            transform 180ms ease;
        }

        .control-shell:hover {
          transform: translateY(-2px);
          border-color: rgba(238, 29, 70, 0.28);
          box-shadow: 0 18px 36px rgba(15, 23, 42, 0.1);
        }

        .control-shell:focus-within,
        .custom-trigger.open,
        .date-trigger.open {
          border-color: #ee1d46;
          box-shadow:
            0 0 0 4px rgba(238, 29, 70, 0.12),
            0 18px 36px rgba(15, 23, 42, 0.12);
        }

        .custom-trigger,
        .date-trigger {
          width: 100%;
          justify-content: space-between;
          text-align: left;
          cursor: pointer;
          appearance: none;
          outline: none;
        }

        .custom-trigger-value,
        .fake-value {
          width: 100%;
          overflow: hidden;
          color: #94a3b8;
          font-size: 16px;
          font-weight: 700;
          line-height: 1.2;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .custom-trigger-value.has-value {
          color: #11233e;
        }

        .control-arrow {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: #64748b;
          font-size: 16px;
          font-weight: 700;
          transition: transform 180ms ease;
        }

        .control-arrow.open {
          transform: translateY(-50%) rotate(180deg);
        }

        .fake-shell {
          background: #f8fafc;
          border-style: dashed;
        }

        .fake-value {
          color: #475569;
        }

        .date-trigger-copy {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .date-value {
          color: #94a3b8;
          font-size: 15px;
          font-weight: 700;
        }

        .date-value.has-value {
          color: #11233e;
        }

        .date-meta {
          color: #94a3b8;
          font-size: 12px;
          font-weight: 600;
        }

        .calendar-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(238, 29, 70, 0.1), rgba(17, 35, 62, 0.08));
          font-size: 18px;
          flex-shrink: 0;
        }

        .floating-panel {
          position: fixed;
          z-index: 99999;
          overflow: hidden;
          border-radius: 24px;
          background: #ffffff;
          border: 1px solid #e6ebf2;
          box-shadow: 0 28px 80px rgba(15, 23, 42, 0.2);
        }

        .floating-select-panel {
          padding: 10px;
        }

        .floating-list {
          display: grid;
          gap: 6px;
        }

        .floating-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          min-height: 50px;
          padding: 0 14px;
          border: 0;
          border-radius: 16px;
          background: transparent;
          color: #11233e;
          font-size: 15px;
          font-weight: 700;
          text-align: left;
          cursor: pointer;
          transition: background 180ms ease, transform 180ms ease, color 180ms ease;
        }

        .floating-option:hover {
          background: #f8fafc;
          transform: translateY(-1px);
        }

        .floating-option.active {
          background: linear-gradient(135deg, rgba(238, 29, 70, 0.1), rgba(255, 79, 114, 0.12));
          color: #ee1d46;
        }

        .option-check {
          font-size: 14px;
          font-weight: 800;
        }

        .date-popover {
          padding: 18px;
        }

        .date-popover-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .date-popover-header strong {
          color: #11233e;
          font-size: 16px;
          font-weight: 800;
        }

        .calendar-nav {
          width: 38px;
          height: 38px;
          border: 0;
          outline: none;
          border-radius: 12px;
          background: #f8fafc;
          color: #11233e;
          font-size: 20px;
          font-weight: 700;
          cursor: pointer;
          transition: background 180ms ease, transform 180ms ease;
          appearance: none;
        }

        .calendar-nav:hover {
          background: #eef2f7;
          transform: translateY(-1px);
        }

        .calendar-weekdays {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 8px;
          margin-bottom: 8px;
        }

        .calendar-weekdays span {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 8px;
        }

        .calendar-day {
          height: 42px;
          border: 0;
          outline: none;
          border-radius: 14px;
          background: #f8fafc;
          color: #11233e;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 180ms ease, background 180ms ease, color 180ms ease, box-shadow 180ms ease;
          appearance: none;
        }

        .calendar-day:hover {
          background: #eef2f7;
          transform: translateY(-1px);
        }

        .calendar-day.muted {
          color: #cbd5e1;
          background: #fbfcfe;
        }

        .calendar-day.selected {
          background: linear-gradient(135deg, #ee1d46 0%, #ff4f72 100%);
          color: #ffffff;
          box-shadow: 0 12px 24px rgba(238, 29, 70, 0.24);
        }

        .calendar-day:disabled {
          cursor: not-allowed;
          color: #cbd5e1;
          background: #f8fafc;
          opacity: 0.55;
          transform: none;
          box-shadow: none;
        }

        .search-error {
          margin-top: 18px;
          padding: 14px 16px;
          border-radius: 16px;
          border: 1px solid rgba(238, 29, 70, 0.2);
          background: rgba(238, 29, 70, 0.08);
          color: #b42318;
          font-size: 14px;
          font-weight: 600;
        }

        .search-footer-updated {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-top: 24px;
        }

        .search-note {
          max-width: 560px;
          margin: 0;
          color: #64748b;
          font-size: 15px;
          line-height: 1.7;
        }

        .search-cta-button {
          min-width: 190px;
          height: 56px;
          padding: 0 28px;
          border: 0;
          border-radius: 999px;
          background: linear-gradient(135deg, #ee1d46 0%, #ff4f72 100%);
          color: #ffffff;
          font-size: 18px;
          font-weight: 800;
          box-shadow: 0 18px 36px rgba(238, 29, 70, 0.28);
          transition: transform 180ms ease, box-shadow 180ms ease;
        }

        .search-cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 24px 40px rgba(238, 29, 70, 0.34);
        }

        .search-cta-button[disabled] {
          opacity: 0.92;
          cursor: progress;
        }

        .search-loading-overlay {
          position: absolute;
          inset: 0;
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: rgba(10, 18, 34, 0.52);
          backdrop-filter: blur(8px);
          border-radius: 32px;
        }

        .search-loading-card {
          width: min(100%, 540px);
          padding: 28px;
          border-radius: 28px;
          background: linear-gradient(180deg, #11233e 0%, #0d1b31 100%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 26px 70px rgba(0, 0, 0, 0.28);
          color: #fff;
        }

        .loading-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(238, 29, 70, 0.16);
          color: #fff;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .search-loading-card h3 {
          margin: 0 0 10px;
          font-size: 28px;
          line-height: 1.1;
        }

        .search-loading-card p {
          margin: 0;
          color: rgba(255, 255, 255, 0.72);
          line-height: 1.65;
        }

        .loading-progress {
          position: relative;
          height: 10px;
          margin-top: 24px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.1);
        }

        .loading-progress span {
          position: absolute;
          inset: 0;
          width: 36%;
          border-radius: inherit;
          background: linear-gradient(90deg, #ee1d46, #ff7391, #ffffff);
          animation: loadingBar 1.15s ease-in-out infinite;
        }

        .loading-steps {
          display: grid;
          gap: 10px;
          margin-top: 18px;
        }

        .loading-step {
          position: relative;
          padding-left: 18px;
          color: rgba(255, 255, 255, 0.76);
          font-size: 14px;
          font-weight: 600;
        }

        .loading-step::before {
          content: '';
          position: absolute;
          top: 7px;
          left: 0;
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #ee1d46;
          box-shadow: 0 0 0 6px rgba(238, 29, 70, 0.12);
        }

        @keyframes loadingBar {
          0% {
            transform: translateX(-120%);
          }
          100% {
            transform: translateX(340%);
          }
        }

        @media (max-width: 1100px) {
          .search-grid-updated {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .field-card-span-2 {
            grid-column: span 1;
          }
        }

        @media (max-width: 768px) {
          .search-shell-updated,
          .search-shell-updated.compact {
            padding: 20px;
            border-radius: 24px;
          }

          .trip-tabs-updated {
            width: 100%;
            overflow-x: auto;
          }

          .trip-tab {
            min-width: 104px;
          }

          .search-grid-updated {
            grid-template-columns: 1fr;
          }

          .search-footer-updated {
            flex-direction: column;
            align-items: stretch;
          }

          .search-cta-button {
            width: 100%;
          }

          .floating-panel {
            width: calc(100vw - 32px) !important;
            left: 16px !important;
          }
        }
      `}</style>
    </>
  )
}