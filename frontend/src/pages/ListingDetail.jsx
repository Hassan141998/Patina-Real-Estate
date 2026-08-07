import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ListingDiagram from '../components/ListingDiagram'
import { useFavorites } from '../context/FavoritesContext'
import { useToast } from '../context/ToastContext'
import { apiFetch, mediaUrl } from '../lib/api'

function formatPrice(n) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

export default function ListingDetail() {
  const { id } = useParams()
  const [listing, setListing] = useState(null)
  const [error, setError] = useState(null)
  const [imageFailed, setImageFailed] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const { push } = useToast()
  const { favorites, toggle } = useFavorites()

  useEffect(() => {
    setListing(null)
    setError(null)
    setImageFailed(false)
    apiFetch(`/listings/${id}`).then(setListing).catch((err) => setError(err.message))
  }, [id])

  useEffect(() => {
    if (listing) {
      setForm((f) => ({ ...f, message: `I'd like to schedule a viewing of ${listing.name}.` }))
    }
  }, [listing])

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await apiFetch('/inquiries', { method: 'POST', body: JSON.stringify({ ...form, listing_id: id }) })
      push('Inquiry sent — an agent will follow up shortly.')
      setForm((f) => ({ ...f, name: '', email: '' }))
    } catch (err) {
      push(err.message, 'err')
    } finally {
      setSubmitting(false)
    }
  }

  if (error) {
    return (
      <p className="form-status err" style={{ padding: '64px 0' }}>
        {error} — <Link to="/listings">back to listings</Link>
      </p>
    )
  }
  if (!listing) {
    return (
      <p className="label" style={{ padding: '64px 0' }}>
        Loading listing…
      </p>
    )
  }

  const isFav = favorites.includes(listing.id)
  const statusClass = `status-${listing.status.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <div className="listing-detail">
      <Link className="btn-ghost" to="/listings">
        ← All listings
      </Link>

      <div className="detail-grid">
        <div className="blueprint-frame" data-caption={`Fig. — ${listing.name}, floor plan`}>
          <div className="detail-diagram-wrap">
            {listing.image_url && !imageFailed ? (
              <img
                src={mediaUrl(listing.image_url)}
                alt={listing.name}
                className="detail-image"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <ListingDiagram seed={listing.id} large />
            )}
          </div>
        </div>

        <div>
          <div className="listing-top">
            <span className="label">{listing.id}</span>
            <span className={`listing-status ${statusClass}`}>{listing.status}</span>
          </div>
          <h2>{listing.name}</h2>
          <p className="listing-address">{listing.address}</p>
          <p className="listing-price detail-price">{formatPrice(listing.price)}</p>

          <div className="detail-specs">
            <div>
              <b>{listing.beds}</b>
              <span>Bedrooms</span>
            </div>
            <div>
              <b>{listing.baths}</b>
              <span>Bathrooms</span>
            </div>
            <div>
              <b>{listing.sqft.toLocaleString()}</b>
              <span>Sq. ft</span>
            </div>
            <div>
              <b>{listing.year_built}</b>
              <span>Built</span>
            </div>
          </div>

          <p className="listing-desc">{listing.description}</p>

          <button type="button" className={`fav-btn-lg ${isFav ? 'is-fav' : ''}`} onClick={() => toggle(listing.id)}>
            {isFav ? '♥ Saved' : '♡ Save this listing'}
          </button>
        </div>
      </div>

      <section className="contact" style={{ marginTop: 48 }}>
        <div>
          <p className="label">Ask about this property</p>
          <h3>Schedule a viewing of {listing.name}</h3>
          <p>An agent typically replies within one business day.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div className="field">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              required
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            />
          </div>
          <button className="btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Sending…' : 'Send inquiry'}
          </button>
        </form>
      </section>
    </div>
  )
}
