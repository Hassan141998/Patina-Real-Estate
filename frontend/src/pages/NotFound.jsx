import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{ padding: '96px 0', textAlign: 'center' }}>
      <p className="label">404</p>
      <h2>That page isn&rsquo;t listed.</h2>
      <p style={{ marginTop: 16 }}>
        <Link className="btn-ghost" to="/">
          Back home
        </Link>
      </p>
    </div>
  )
}
