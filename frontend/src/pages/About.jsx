import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="static-page">
      <div className="section-head" style={{ borderTop: 'none', paddingTop: '48px' }}>
        <div>
          <p className="label">About Patina</p>
          <h3>We sell buildings that already know what they are.</h3>
        </div>
      </div>

      <p className="lede">
        Patina started in 2016 with a simple frustration: every &ldquo;character
        home&rdquo; listing on the market had been stripped of its actual
        character — sanded, painted, and staged into a version of itself that
        could belong anywhere. We wanted to sell the buildings that
        hadn&rsquo;t been flattened yet.
      </p>

      <div className="about-timeline">
        <div className="timeline-row">
          <span className="label">2016</span>
          <p>Founded in Kingston, NY, with a single listing: a converted grain elevator.</p>
        </div>
        <div className="timeline-row">
          <span className="label">2019</span>
          <p>Expanded south along the Hudson Valley corridor; placed our 50th building.</p>
        </div>
        <div className="timeline-row">
          <span className="label">2022</span>
          <p>Opened a second desk in Providence, RI, to cover New England mill towns.</p>
        </div>
        <div className="timeline-row">
          <span className="label">2026</span>
          <p>112 buildings placed, four agents, one still-unrenovated office above a former print shop.</p>
        </div>
      </div>

      <div className="values-grid">
        <div className="value-card">
          <span className="label">01 — Legibility</span>
          <p>If you can&rsquo;t tell what a building used to be, we probably won&rsquo;t list it.</p>
        </div>
        <div className="value-card">
          <span className="label">02 — Patience</span>
          <p>The right building for the wrong buyer sits longer than the right building for the right one. We wait.</p>
        </div>
        <div className="value-card">
          <span className="label">03 — Documentation</span>
          <p>Every listing includes what we know about the building&rsquo;s original use, not just its current condition.</p>
        </div>
      </div>

      <div className="cta-banner">
        <div>
          <p className="label">Get in touch</p>
          <h3>Meet the agents who find these buildings.</h3>
        </div>
        <Link className="btn-primary" to="/agents">
          Meet the team
        </Link>
      </div>
    </div>
  )
}
