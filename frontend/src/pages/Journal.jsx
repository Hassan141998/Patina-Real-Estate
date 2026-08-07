import { useMemo, useState } from 'react'

const CATEGORIES = ['All', 'Company News', 'Market Notes', 'Press']

const POSTS = [
  { title: 'Spring listings: what\u2019s coming to market', category: 'Market Notes', date: 'Apr 2026', excerpt: 'A look at six buildings entering pre-listing this spring, from a converted signal tower to a second barn conversion outside Kingston.' },
  { title: 'Reading a building before you buy it', category: 'Market Notes', date: 'Feb 2026', excerpt: 'What to look for on a first walkthrough of a converted structure \u2014 and which "quirks" are actually load-bearing history.' },
  { title: 'Patina named in a regional \u201cbest of\u201d real estate roundup', category: 'Press', date: 'Jan 2026', excerpt: 'A short writeup on the agency\u2019s approach to documenting a building\u2019s original use alongside its current listing.' },
  { title: '112 buildings placed: a look back', category: 'Company News', date: 'Dec 2025', excerpt: 'Ten years in, a tally of what\u2019s moved through Patina\u2019s desks \u2014 by building type, by decade built, and by how long each sat on the market.' },
  { title: 'Why converted buildings hold value differently', category: 'Market Notes', date: 'Nov 2025', excerpt: 'Appreciation patterns for adaptive-reuse properties don\u2019t always track with the broader market \u2014 here\u2019s what we\u2019ve seen across a decade of sales.' },
  { title: 'New agent: Jonah Kessler joins the Troy desk', category: 'Company News', date: 'Sep 2025', excerpt: 'Jonah grew up in a foundry town and specializes in industrial-to-residential conversions. He\u2019s now handling the Troy and Hoosick Falls corridor.' },
  { title: 'Financing a non-standard structure', category: 'Market Notes', date: 'Jul 2025', excerpt: 'Notes on which lenders in our network are comfortable underwriting barn conversions, mixed-use buildings, and other properties that don\u2019t fit a standard appraisal template.' },
  { title: 'Patina featured on a regional preservation podcast', category: 'Press', date: 'May 2025', excerpt: 'A conversation about adaptive reuse, documentation practices, and why "character" shouldn\u2019t mean "renovated beyond recognition."' },
  { title: 'A season of barn conversions', category: 'Market Notes', date: 'Mar 2025', excerpt: 'Three barn conversions sold within a six-week window this spring \u2014 a look at what buyers were actually comparing them against.' },
  { title: 'Opening the Providence desk', category: 'Company News', date: 'Jan 2025', excerpt: 'Patina\u2019s New England expansion, five years on: what changed moving from a single-state to a two-state operation.' },
]

const PAGE_SIZE = 6

function CategoryGlyph({ category }) {
  // A small consistent glyph per category instead of a stock photo thumbnail.
  const marks = {
    'Company News': 'CN',
    'Market Notes': 'MN',
    Press: 'PR',
  }
  return <span className="journal-glyph">{marks[category] || 'PT'}</span>
}

export default function Journal() {
  const [category, setCategory] = useState('All')
  const [page, setPage] = useState(1)

  const filtered = useMemo(
    () => (category === 'All' ? POSTS : POSTS.filter((p) => p.category === category)),
    [category]
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function selectCategory(c) {
    setCategory(c)
    setPage(1)
  }

  return (
    <div className="static-page">
      <div className="section-head" style={{ borderTop: 'none', paddingTop: '48px' }}>
        <div>
          <p className="label">Journal</p>
          <h3>Notes from the desks</h3>
        </div>
      </div>

      <div className="filter-bar">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            className={`toggle-chip ${category === c ? 'is-active' : ''}`}
            onClick={() => selectCategory(c)}
            aria-pressed={category === c}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="journal-grid">
        {pageItems.map((p) => (
          <article className="journal-card" key={p.title}>
            <div className="journal-top">
              <CategoryGlyph category={p.category} />
              <span className="label">{p.date}</span>
            </div>
            <h4>{p.title}</h4>
            <p>{p.excerpt}</p>
            <span className="label journal-category">{p.category}</span>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="pagination" aria-label="Journal pagination">
          <button
            type="button"
            className="pagination-arrow"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label="Previous page"
          >
            &larr;
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              className={`pagination-num ${page === n ? 'is-active' : ''}`}
              onClick={() => setPage(n)}
              aria-current={page === n ? 'page' : undefined}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            className="pagination-arrow"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            aria-label="Next page"
          >
            &rarr;
          </button>
        </nav>
      )}
    </div>
  )
}
