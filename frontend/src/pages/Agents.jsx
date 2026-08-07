const AGENTS = [
  {
    initials: 'DW',
    name: 'Dana Whitfield',
    role: 'Founding Agent',
    region: 'Hudson Valley, NY',
    bio: "Started Patina after eight years restoring buildings for other people's clients and deciding to just sell them instead.",
  },
  {
    initials: 'RO',
    name: 'Reyes Okafor',
    role: 'Senior Agent',
    region: 'Providence, RI',
    bio: "Handles the New England desk; former structural engineer who reads a listing's bones before its finishes.",
  },
  {
    initials: 'MT',
    name: 'Mara Thibodeaux',
    role: 'Agent',
    region: 'Beacon, NY',
    bio: 'Focuses on live/work conversions — former textile mills, print shops, and studio spaces.',
  },
  {
    initials: 'JK',
    name: 'Jonah Kessler',
    role: 'Agent',
    region: 'Troy, NY',
    bio: 'Grew up in a foundry town; specializes in industrial-to-residential conversions.',
  },
]

export default function Agents() {
  return (
    <div className="static-page">
      <div className="section-head" style={{ borderTop: 'none', paddingTop: '48px' }}>
        <div>
          <p className="label">The team</p>
          <h3>Four agents, two states, one waitlist.</h3>
        </div>
        <p>Every listing on Patina is handled directly by the agent who found it — no hand-offs.</p>
      </div>
      <div className="agents-grid">
        {AGENTS.map((a) => (
          <div className="agent-card" key={a.name}>
            <div className="agent-avatar" aria-hidden="true">
              {a.initials}
            </div>
            <h4>{a.name}</h4>
            <p className="label">
              {a.role} · {a.region}
            </p>
            <p className="agent-bio">{a.bio}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
