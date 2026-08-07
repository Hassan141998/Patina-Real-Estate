export function ListingCardSkeleton() {
  return (
    <div className="listing-card skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton-line" style={{ width: '30%' }} />
      <div className="skeleton skeleton-block" />
      <div className="skeleton skeleton-line" style={{ width: '60%' }} />
      <div className="skeleton skeleton-line" style={{ width: '90%' }} />
      <div className="skeleton skeleton-line" style={{ width: '80%' }} />
    </div>
  )
}
