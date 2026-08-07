import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFavorites } from '../context/FavoritesContext'
import { mediaUrl } from '../lib/api'
import ListingDiagram from './ListingDiagram'

const STATUS_CLASS = {
  'For Sale': 'status-for-sale',
  'Under Offer': 'status-under-offer',
  Sold: 'status-sold',
}

function formatPrice(n) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

export default function ListingCard({ listing }) {
  const { favorites, toggle } = useFavorites()
  const [imageFailed, setImageFailed] = useState(false)
  const isFav = favorites.includes(listing.id)
  const showImage = listing.image_url && !imageFailed

  return (
    <article className="listing-card">
      <div className="listing-top">
        <span className="label">{listing.id}</span>
        <div className="listing-top-right">
          <button
            type="button"
            className={`fav-btn ${isFav ? 'is-fav' : ''}`}
            onClick={() => toggle(listing.id)}
            aria-pressed={isFav}
            aria-label={isFav ? `Remove ${listing.name} from favorites` : `Save ${listing.name} to favorites`}
          >
            ♥
          </button>
          <span className={`listing-status ${STATUS_CLASS[listing.status] || ''}`}>{listing.status}</span>
        </div>
      </div>
      <Link to={`/listings/${listing.id}`} className="listing-diagram">
        {showImage ? (
          <img src={mediaUrl(listing.image_url)} alt={listing.name} onError={() => setImageFailed(true)} />
        ) : (
          <ListingDiagram seed={listing.id} />
        )}
      </Link>
      <Link to={`/listings/${listing.id}`} className="listing-name-link">
        <h4 className="listing-name">{listing.name}</h4>
      </Link>
      <p className="listing-address">{listing.address}</p>
      <p className="listing-desc">{listing.description}</p>
      <div className="listing-meta">
        <span>
          {listing.beds} bd · {listing.baths} ba · {listing.sqft.toLocaleString()} sf
        </span>
        <span className="listing-price">{formatPrice(listing.price)}</span>
      </div>
    </article>
  )
}
