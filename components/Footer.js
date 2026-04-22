import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <span className="eyebrow light">WLS Air</span>
          <h3>World Link Star travel platform</h3>
          <p>Search flights, book travelers, manage itineraries, and review operations from one branded workflow.</p>
        </div>
        <div>
          <h4>Quick links</h4>
          <div className="footer-links">
            <Link href="/">Home</Link>
            <Link href="/manage-booking">Manage Booking</Link>
            <Link href="/admin">Admin</Link>
          </div>
        </div>
        <div>
          <h4>Contact</h4>
          <div className="footer-contact">
            <span>Reservations desk</span>
            <strong>support@wlsair.com</strong>
            <strong>+880 2 5500 7788</strong>
          </div>
        </div>
      </div>
    </footer>
  )
}
