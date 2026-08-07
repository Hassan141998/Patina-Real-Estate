import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../App'
import { AuthProvider } from '../context/AuthContext'
import { FavoritesProvider } from '../context/FavoritesContext'
import { ThemeProvider } from '../context/ThemeContext'
import { ToastProvider } from '../context/ToastContext'

function renderApp(route = '/') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <ThemeProvider>
        <AuthProvider>
          <FavoritesProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </FavoritesProvider>
        </AuthProvider>
      </ThemeProvider>
    </MemoryRouter>
  )
}

beforeEach(() => {
  localStorage.clear()
  global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve([]) }))
})

describe('App', () => {
  it('renders the nav brand', () => {
    renderApp('/')
    // "Patina" appears in both the nav and the footer sitemap
    expect(screen.getAllByText('Patina').length).toBeGreaterThanOrEqual(1)
  })

  it('renders the hero headline on the home page', () => {
    renderApp('/')
    expect(screen.getByText(/already/i)).toBeInTheDocument()
  })

  it('shows a 404 page for unknown routes', () => {
    renderApp('/nowhere')
    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('redirects to login when visiting the dashboard unauthenticated', () => {
    renderApp('/dashboard')
    expect(screen.getByText(/log in to manage listings/i)).toBeInTheDocument()
  })

  it('renders the About page', () => {
    renderApp('/about')
    expect(screen.getByText(/already know what they are/i)).toBeInTheDocument()
  })

  it('renders the Agents page with team members', () => {
    renderApp('/agents')
    expect(screen.getByText('Dana Whitfield')).toBeInTheDocument()
  })

  it('renders the FAQ page as an accordion', () => {
    renderApp('/faq')
    expect(screen.getByText(/pre-listing waitlist/i)).toBeInTheDocument()
  })

  it('renders the Privacy Policy page', () => {
    renderApp('/privacy')
    expect(screen.getByRole('heading', { name: 'Privacy Policy' })).toBeInTheDocument()
  })

  it('renders the Terms of Service page', () => {
    renderApp('/terms')
    expect(screen.getByRole('heading', { name: 'Terms of Service' })).toBeInTheDocument()
  })

  it('renders the Journal page with filterable posts', () => {
    renderApp('/journal')
    expect(screen.getByText('Notes from the desks')).toBeInTheDocument()
  })

  it('renders the Where We Work page with regions', () => {
    renderApp('/areas')
    expect(screen.getByText('New York')).toBeInTheDocument()
  })
})
