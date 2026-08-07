import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ListingCard from '../components/ListingCard'
import { ListingCardSkeleton } from '../components/Skeleton'
import { apiFetch } from '../lib/api'

function Hero() {
  return (
    <section className="hero">
      <div>
        <p className="label hero-eyebrow">Hudson Valley &amp; environs — est. 2016</p>
        <h2>
          Buildings that already <span className="hero-italic">have a story.</span>
        </h2>
        <p className="hero-sub">
          Patina represents converted mills, kilns, barns, and rowhouses —
          places with a working past, sold to people who want to keep it
          legible rather than renovate it away.
        </p>
        <div className="hero-actions">
          <Link className="btn-primary" to="/listings">
            View current listings
          </Link>
          <Link className="btn-ghost" to="/contact">
            Talk to an agent
          </Link>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <b>112</b>
            <span>Buildings placed</span>
          </div>
          <div className="hero-stat">
            <b>1888–1961</b>
            <span>Typical build range</span>
          </div>
          <div className="hero-stat">
            <b>9 yrs</b>
            <span>Avg. agent tenure</span>
          </div>
        </div>
      </div>

      <div className="blueprint-frame" data-caption="Fig. 1 — Kiln House, ground floor">
        <svg className="blueprint-svg" viewBox="0 0 400 320" role="img" aria-label="Architectural floor plan line drawing">
          <rect x="30" y="30" width="340" height="260" />
          <line x1="30" y1="140" x2="200" y2="140" />
          <line x1="200" y1="30" x2="200" y2="290" />
          <rect x="230" y="60" width="110" height="80" />
          <circle cx="90" cy="90" r="4" />
          <line x1="30" y1="90" x2="70" y2="90" style={{ animationDelay: '0.4s' }} />
          <line x1="200" y1="200" x2="340" y2="200" style={{ animationDelay: '0.6s' }} />
          <rect x="60" y="180" width="90" height="60" style={{ animationDelay: '0.3s' }} />
          <text x="45" y="50">COURTYARD</text>
          <text x="245" y="55">STUDY</text>
          <text x="70" y="270">KITCHEN</text>
        </svg>
      </div>
    </section>
  )
}

export default function Home() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch('/listings')
      .then((data) => setListings(data.slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Hero />
      <div className="section-head">
        <div>
          <p className="label">Featured</p>
          <h3>Three properties on the market now</h3>
        </div>
        <Link className="btn-ghost" to="/listings">
          View all listings →
        </Link>
      </div>
      <div className="listings-grid">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <ListingCardSkeleton key={i} />)
          : listings.map((l) => <ListingCard key={l.id} listing={l} />)}
      </div>
    </>
  )
}
