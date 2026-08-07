import { useState } from 'react'
import { apiFetch } from '../lib/api'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setStatus(null)
    try {
      await apiFetch('/inquiries', { method: 'POST', body: JSON.stringify(form) })
      setStatus({ ok: true, text: 'Sent — an agent will reply within one business day.' })
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      setStatus({ ok: false, text: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="contact" style={{ borderTop: 'none', paddingTop: '48px' }}>
      <div>
        <p className="label">Get in touch</p>
        <h3>Start a search, or ask a general question.</h3>
        <p>Patina keeps a short waitlist for buildings before they&rsquo;re publicly listed.</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" required value={form.name} onChange={update('name')} />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" required value={form.email} onChange={update('email')} />
        </div>
        <div className="field">
          <label htmlFor="message">Message</label>
          <textarea id="message" required value={form.message} onChange={update('message')} />
        </div>
        <button className="btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Sending…' : 'Send message'}
        </button>
        {status && <p className={`form-status ${status.ok ? 'ok' : 'err'}`}>{status.text}</p>}
      </form>
    </section>
  )
}
