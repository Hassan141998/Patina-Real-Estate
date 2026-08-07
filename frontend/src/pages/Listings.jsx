import { useEffect, useMemo, useState } from 'react'
import ListingCard from '../components/ListingCard'
import { ListingCardSkeleton } from '../components/Skeleton'
import { useFavorites } from '../context/FavoritesContext'
import { apiFetch } from '../lib/api'

const TYPES = [
  'Detached', 'Townhouse', 'Semi-Detached', 'Cottage',
  'Barn Conversion', 'Live/Work Loft', 'Industrial Conversion',
  'Firehouse Conversion', 'Schoolhouse Conversion', 'Chapel Conversion',
  'Icehouse Conversion', 'Mill Conversion',
  'Apartment', 'Retail/Shop', 'Office Building', 'Mixed-Use Building',
]
const STATUSES = ['For Sale', 'Under Offer', 'Sold']

export default function Listings() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({ status: '', type: '', min_beds: '', search: '' })
  const [favOnly, setFavOnly] = useState(false)
  const { favorites } = useFavorites()

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.set(k, v)
    })
    const handle = setTimeout(() => {
      apiFetch(`/listings?${params.toString()}`)
        .then(setListings)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false))
    }, 250) // debounce search typing
    return () => clearTimeout(handle)
  }, [filters])

  const visible = useMemo(
    () => (favOnly ? listings.filter((l) => favorites.includes(l.id)) : listings),
    [listings, favOnly, favorites]
  )

  function update(field) {
    return (e) => setFilters((f) => ({ ...f, [field]: e.target.value }))
  }

  return (
    <>
      <div className="section-head">
        <div>
          <p className="label">Current inventory</p>
          <h3>All listings</h3>
        </div>
        <p>Filter by status, type, or minimum bedrooms — or search by name and address.</p>
      </div>

      <div className="filter-bar">
        <input placeholder="Search listings…" value={filters.search} onChange={update('search')} aria-label="Search listings" />
        <select value={filters.status} onChange={update('status')} aria-label="Filter by status">
          <option value="">Any status</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select value={filters.type} onChange={update('type')} aria-label="Filter by type">
          <option value="">Any type</option>
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select value={filters.min_beds} onChange={update('min_beds')} aria-label="Minimum bedrooms">
          <option value="">Any beds</option>
          {[1, 2, 3, 4].map((n) => (
            <option key={n} value={n}>
              {n}+ bd
            </option>
          ))}
        </select>
        <button
          type="button"
          className={`toggle-chip ${favOnly ? 'is-active' : ''}`}
          onClick={() => setFavOnly((v) => !v)}
          aria-pressed={favOnly}
        >
          ♥ Saved only
        </button>
      </div>

      {loading && (
        <div className="listings-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <ListingCardSkeleton key={i} />
          ))}
        </div>
      )}
      {error && <p className="form-status err">{error}</p>}
      {!loading && !error && (
        visible.length ? (
          <div className="listings-grid">
            {visible.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        ) : (
          <p className="label" style={{ padding: '32px 0 64px' }}>
            No listings match those filters.
          </p>
        )
      )}
    </>
  )
}
