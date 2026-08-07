const REGIONS = [
  { state: 'New York', cities: ['Hudson Valley', 'Beacon', 'Troy', 'New Paltz', 'Hudson', 'Peekskill', 'Catskill', 'Hoosick Falls', 'Kingston', 'Newburgh', 'Poughkeepsie'] },
  { state: 'Rhode Island', cities: ['Providence', 'Warren', 'Pawtucket'] },
  { state: 'Massachusetts', cities: ['Northampton', 'Holyoke', 'Pittsfield'] },
  { state: 'Connecticut', cities: ['New Haven', 'Bridgeport'] },
]

function RegionMapDot({ index }) {
  // Deterministic pseudo-scatter so each region gets a distinct placement
  // on the small illustrative map, without needing a real map API/key.
  const x = 60 + ((index * 53) % 260)
  const y = 40 + ((index * 37) % 160)
  return <circle cx={x} cy={y} r="5" />
}

export default function Areas() {
  const totalCities = REGIONS.reduce((sum, r) => sum + r.cities.length, 0)

  return (
    <div className="static-page">
      <div className="section-head" style={{ borderTop: 'none', paddingTop: '48px' }}>
        <div>
          <p className="label">Where we work</p>
          <h3>Four states, {totalCities} towns, one desk each.</h3>
        </div>
        <p>Patina doesn&rsquo;t list outside these markets — every agent works the towns they actually know.</p>
      </div>

      <div className="areas-layout">
        <div className="areas-accordion">
          {REGIONS.map((r) => (
            <details className="faq-item" key={r.state} open={r.state === 'New York'}>
              <summary>
                {r.state} <span className="label areas-count">{r.cities.length} towns</span>
              </summary>
              <ul className="areas-city-list">
                {r.cities.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </details>
          ))}
        </div>

        <div className="areas-map-frame" aria-hidden="true">
          <svg viewBox="0 0 380 240" role="img" aria-label="Illustrative map of Patina's four-state coverage area">
            <rect x="10" y="10" width="360" height="220" />
            <line x1="10" y1="80" x2="370" y2="80" />
            <line x1="10" y1="150" x2="370" y2="150" />
            <line x1="130" y1="10" x2="130" y2="230" />
            <line x1="250" y1="10" x2="250" y2="230" />
            {REGIONS.map((_, i) => (
              <RegionMapDot key={i} index={i} />
            ))}
          </svg>
        </div>
      </div>

      <div className="hero-stats areas-stats">
        <div className="hero-stat">
          <b>{REGIONS.length}</b>
          <span>States served</span>
        </div>
        <div className="hero-stat">
          <b>{totalCities}</b>
          <span>Towns with active listings</span>
        </div>
        <div className="hero-stat">
          <b>2016</b>
          <span>First market opened</span>
        </div>
      </div>
    </div>
  )
}
