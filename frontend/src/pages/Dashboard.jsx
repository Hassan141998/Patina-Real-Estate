import { useEffect, useState } from 'react'
import { useToast } from '../context/ToastContext'
import { apiFetch, apiUpload } from '../lib/api'

const EMPTY_FORM = {
  id: '', name: '', address: '', price: '', type: 'Detached', status: 'For Sale',
  beds: '', baths: '', sqft: '', year_built: '', description: '',
}

export default function Dashboard() {
  const [listings, setListings] = useState([])
  const [inquiries, setInquiries] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const { push } = useToast()

  async function refresh() {
    const [l, i] = await Promise.all([apiFetch('/listings'), apiFetch('/inquiries')])
    setListings(l)
    setInquiries(i)
  }

  useEffect(() => {
    refresh()
      .catch((err) => push(err.message, 'err'))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  function startEdit(listing) {
    setEditingId(listing.id)
    setForm({ ...listing })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetForm() {
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const payload = {
      ...form,
      price: Number(form.price),
      beds: Number(form.beds),
      baths: Number(form.baths),
      sqft: Number(form.sqft),
      year_built: Number(form.year_built),
    }
    try {
      if (editingId) {
        await apiFetch(`/listings/${editingId}`, { method: 'PUT', body: JSON.stringify(payload) })
        push('Listing updated.')
      } else {
        await apiFetch('/listings', { method: 'POST', body: JSON.stringify(payload) })
        push('Listing created.')
      }
      resetForm()
      refresh()
    } catch (err) {
      push(err.message, 'err')
    }
  }

  async function handleDelete(id) {
    if (!window.confirm(`Delete listing ${id}? This can't be undone.`)) return
    try {
      await apiFetch(`/listings/${id}`, { method: 'DELETE' })
      push('Listing deleted.')
      refresh()
    } catch (err) {
      push(err.message, 'err')
    }
  }

  async function handleImage(id, file) {
    const fd = new FormData()
    fd.append('image', file)
    try {
      await apiUpload(`/listings/${id}/image`, fd)
      push('Image uploaded.')
      refresh()
    } catch (err) {
      push(err.message, 'err')
    }
  }

  if (loading) {
    return (
      <p className="label" style={{ padding: '64px 0' }}>
        Loading dashboard…
      </p>
    )
  }

  return (
    <div className="dashboard">
      <div className="section-head">
        <div>
          <p className="label">Agent dashboard</p>
          <h3>{editingId ? `Editing ${editingId}` : 'Add a listing'}</h3>
        </div>
      </div>

      <form className="dashboard-form" onSubmit={handleSubmit}>
        <div className="field">
          <label>Listing ID</label>
          <input value={form.id} onChange={update('id')} required disabled={!!editingId} placeholder="e.g. FL-118" />
        </div>
        <div className="field">
          <label>Name</label>
          <input value={form.name} onChange={update('name')} required />
        </div>
        <div className="field">
          <label>Address</label>
          <input value={form.address} onChange={update('address')} required />
        </div>
        <div className="field">
          <label>Price (USD)</label>
          <input type="number" value={form.price} onChange={update('price')} required />
        </div>
        <div className="field">
          <label>Type</label>
          <input value={form.type} onChange={update('type')} required />
        </div>
        <div className="field">
          <label>Status</label>
          <select value={form.status} onChange={update('status')}>
            <option>For Sale</option>
            <option>Under Offer</option>
            <option>Sold</option>
          </select>
        </div>
        <div className="field">
          <label>Beds</label>
          <input type="number" value={form.beds} onChange={update('beds')} required />
        </div>
        <div className="field">
          <label>Baths</label>
          <input type="number" value={form.baths} onChange={update('baths')} required />
        </div>
        <div className="field">
          <label>Sq. ft</label>
          <input type="number" value={form.sqft} onChange={update('sqft')} required />
        </div>
        <div className="field">
          <label>Year built</label>
          <input type="number" value={form.year_built} onChange={update('year_built')} required />
        </div>
        <div className="field field-wide">
          <label>Description</label>
          <textarea value={form.description} onChange={update('description')} required />
        </div>
        <div className="dashboard-form-actions">
          <button className="btn-primary" type="submit">
            {editingId ? 'Save changes' : 'Create listing'}
          </button>
          {editingId && (
            <button type="button" className="btn-ghost" onClick={resetForm}>
              Cancel edit
            </button>
          )}
        </div>
      </form>

      <div className="section-head">
        <div>
          <p className="label">Inventory</p>
          <h3>{listings.length} listings</h3>
        </div>
      </div>
      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Status</th>
              <th>Price</th>
              <th>Photo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {listings.map((l) => (
              <tr key={l.id}>
                <td className="label">{l.id}</td>
                <td>{l.name}</td>
                <td>{l.status}</td>
                <td>${l.price.toLocaleString()}</td>
                <td>
                  <label className="upload-btn">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => e.target.files[0] && handleImage(l.id, e.target.files[0])}
                    />
                  </label>
                </td>
                <td className="admin-actions">
                  <button type="button" className="btn-ghost" onClick={() => startEdit(l)}>
                    Edit
                  </button>
                  <button type="button" className="btn-ghost danger" onClick={() => handleDelete(l.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section-head">
        <div>
          <p className="label">Inbox</p>
          <h3>{inquiries.length} inquiries</h3>
        </div>
      </div>
      <div className="inquiries-list">
        {inquiries.map((i) => (
          <div key={i.id} className="inquiry-row">
            <div>
              <b>{i.name}</b> <span className="label">{i.email}</span>
              {i.listing_id && <span className="label"> · re: {i.listing_id}</span>}
            </div>
            <p>{i.message}</p>
          </div>
        ))}
        {!inquiries.length && <p className="label">No inquiries yet.</p>}
      </div>
    </div>
  )
}
