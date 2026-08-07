import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import ListingCard from '../components/ListingCard'
import { FavoritesProvider } from '../context/FavoritesContext'

const listing = {
  id: 'TST-001',
  name: 'Test House',
  address: '1 Test St',
  price: 100000,
  status: 'For Sale',
  beds: 2,
  baths: 1,
  sqft: 900,
  description: 'A test listing.',
  image_url: null,
}

beforeEach(() => {
  localStorage.clear()
})

function renderCard() {
  return render(
    <MemoryRouter>
      <FavoritesProvider>
        <ListingCard listing={listing} />
      </FavoritesProvider>
    </MemoryRouter>
  )
}

describe('ListingCard', () => {
  it('renders listing name and formatted price', () => {
    renderCard()
    expect(screen.getByText('Test House')).toBeInTheDocument()
    expect(screen.getByText('$100,000')).toBeInTheDocument()
  })

  it('toggles favorite state on click', () => {
    renderCard()
    const favButton = screen.getByRole('button', { name: /save test house to favorites/i })
    expect(favButton).toHaveAttribute('aria-pressed', 'false')
    fireEvent.click(favButton)
    expect(favButton).toHaveAttribute('aria-pressed', 'true')
  })
})
