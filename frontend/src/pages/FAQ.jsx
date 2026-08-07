const FAQS = [
  {
    q: 'Do you only sell converted or historic buildings?',
    a: "Mostly, yes. Occasionally we take on a newer building if it has an unusual structural story, but the bulk of our inventory is pre-1970 and previously used for something other than housing.",
  },
  {
    q: 'How do I get on the pre-listing waitlist?',
    a: "Send a message through the Contact page with what you're looking for — building type, region, budget range — and we'll flag anything close before it's public.",
  },
  {
    q: 'Can I schedule a viewing without an agent?',
    a: "Every viewing is scheduled through the listing agent. Use the inquiry form on a listing's page and someone will follow up within a business day.",
  },
  {
    q: 'Do you handle financing for unconventional structures?',
    a: "We don't originate loans, but we can point you to lenders in our network who are comfortable underwriting barn conversions, mixed-use buildings, and other non-standard properties.",
  },
  {
    q: "What happens to a listing once it's under offer?",
    a: 'It stays visible with an "Under Offer" status until closing, then moves to "Sold." We don\'t pull listings early — buyers researching the market should be able to see full history.',
  },
]

export default function FAQ() {
  return (
    <div className="static-page">
      <div className="section-head" style={{ borderTop: 'none', paddingTop: '48px' }}>
        <div>
          <p className="label">FAQ</p>
          <h3>Common questions</h3>
        </div>
      </div>
      <div className="faq-list">
        {FAQS.map((f) => (
          <details className="faq-item" key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  )
}
