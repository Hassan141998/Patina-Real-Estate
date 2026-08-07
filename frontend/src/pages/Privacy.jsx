export default function Privacy() {
  return (
    <div className="static-page legal-page">
      <div className="section-head" style={{ borderTop: 'none', paddingTop: '48px' }}>
        <div>
          <p className="label">Legal</p>
          <h3>Privacy Policy</h3>
        </div>
      </div>
      <p className="legal-note">
        This is placeholder text for a demo project — replace with real policy language before deploying anywhere real.
      </p>
      <h4>Information we collect</h4>
      <p>
        When you submit an inquiry through this site, we store your name, email address, and
        message, along with the listing you asked about, if any.
      </p>
      <h4>How we use it</h4>
      <p>
        We use inquiry information to respond to you about the property or question you raised.
        We don&rsquo;t sell or share contact information with third parties.
      </p>
      <h4>Data retention</h4>
      <p>
        Inquiries remain in our system so agents can reference prior conversations. You can
        request deletion at any time by contacting us.
      </p>
      <h4>Cookies &amp; local storage</h4>
      <p>
        This site stores a theme preference and your saved-listing selections in your
        browser&rsquo;s local storage. Neither is sent to a server or used for tracking.
      </p>
    </div>
  )
}
