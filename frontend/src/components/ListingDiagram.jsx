/* A small procedurally-varied floor-plan glyph per listing so every card
   reads as a distinct property rather than a repeated stock icon. */
export default function ListingDiagram({ seed, large = false }) {
  const n = seed.charCodeAt(0) + seed.length
  const notch = n % 3 === 0

  return (
    <svg viewBox="0 0 140 90" className={large ? 'diagram-lg' : ''} aria-hidden="true">
      <rect x="10" y="10" width="120" height="70" />
      <line x1="70" y1="10" x2="70" y2="80" />
      {notch ? <rect x="70" y="10" width="30" height="30" /> : <line x1="10" y1="45" x2="70" y2="45" />}
      <circle cx="20" cy="20" r="1.6" />
    </svg>
  )
}
