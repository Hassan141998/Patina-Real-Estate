import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Nav() {
  const { token, agent, logout } = useAuth()
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav className="nav">
      <Link to="/" className="nav-mark">
        <h1>Patina</h1>
        <span className="label">Real Estate</span>
      </Link>
      <ul className="nav-links">
        <li>
          <NavLink to="/listings">Listings</NavLink>
        </li>
        <li>
          <NavLink to="/about">About</NavLink>
        </li>
        <li>
          <NavLink to="/contact">Contact</NavLink>
        </li>
        {token ? (
          <>
            <li>
              <NavLink to="/dashboard">Dashboard</NavLink>
            </li>
            <li>
              <button type="button" className="link-btn" onClick={handleLogout}>
                Log out{agent ? ` (${agent.username})` : ''}
              </button>
            </li>
          </>
        ) : (
          <li>
            <NavLink to="/login">Agent login</NavLink>
          </li>
        )}
      </ul>
      <div className="nav-right">
        <button
          type="button"
          className="theme-toggle"
          onClick={toggle}
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? '☾' : '☀'}
        </button>
        <Link className="nav-cta" to="/contact">
          Book a viewing
        </Link>
      </div>
    </nav>
  )
}
