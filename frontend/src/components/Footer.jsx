import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <h1 className="footer-mark">Patina</h1>
          <p className="label">Real Estate</p>
        </div>

        <div className="footer-col">
          <p className="label">Company</p>
          <ul>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/agents">Agents</Link></li>
            <li><Link to="/areas">Where We Work</Link></li>
            <li><Link to="/journal">Journal</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <p className="label">Browse</p>
          <ul>
            <li><Link to="/listings">Listings</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/login">Agent login</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <p className="label">Legal</p>
          <ul>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Patina Real Estate</span>
        <span>Hudson Valley, NY</span>
      </div>
    </footer>
  )
}
