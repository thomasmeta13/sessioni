import { useState } from 'react'

const pages = [
  {
    file: 'dashboard.html',
    title: 'Cognition OS',
    desc: 'Full dashboard with modals, live metrics, and system overview',
    tag: 'React App',
    tagClass: 'tag-react',
  },
  {
    file: 'index.html',
    title: 'Cognition OS — Lite',
    desc: 'Lightweight version of the Cognition OS interface',
    tag: 'React App',
    tagClass: 'tag-react',
  },
  {
    file: 'abraxas.html',
    title: 'Abraxas Explorer',
    desc: 'Beyond the Demiurge — an interactive Gnostic knowledge explorer',
    tag: 'Gnostic',
    tagClass: 'tag-gnostic',
  },
  {
    file: 'archons.html',
    title: 'Name the Archons',
    desc: 'Interactive challenge from the Abraxas Explorer series',
    tag: 'Gnostic',
    tagClass: 'tag-gnostic',
  },
  {
    file: 'apartment.html',
    title: '5402 E. 69th St. Apt',
    desc: 'NYC apartment listing with elegant layout',
    tag: 'Listing',
    tagClass: 'tag-listing',
  },
  {
    file: 'divina_commedia.txt',
    title: 'La Divina Commedia',
    desc: 'Dante Alighieri — Inferno, Canto I',
    tag: 'Literature',
    tagClass: 'tag-text',
    isTxt: true,
  },
]

export default function ProjectsPage() {
  const [active, setActive] = useState(null)
  const [txtContent, setTxtContent] = useState('')

  const openPage = async (page) => {
    if (page.isTxt) {
      const res = await fetch(`/pages/${page.file}`)
      const text = await res.text()
      setTxtContent(text)
    }
    setActive(page)
  }

  if (active) {
    return (
      <div className="viewer">
        <div className="viewer-bar">
          <button className="viewer-back" onClick={() => setActive(null)}>
            ← Back
          </button>
          <span className="viewer-title">{active.title}</span>
          <span className="viewer-file">{active.file}</span>
        </div>
        {active.isTxt ? (
          <div className="txt-view">{txtContent}</div>
        ) : (
          <iframe src={`/pages/${active.file}`} title={active.title} />
        )}
      </div>
    )
  }

  return (
    <div className="nav-grid">
      {pages.map((page) => (
        <div key={page.file} className="nav-card" onClick={() => openPage(page)}>
          <div className="card-preview">
            {page.isTxt ? (
              <div className="txt-preview">
                Nel mezzo del cammin di nostra vita{'\n'}
                mi ritrovai per una selva oscura,{'\n'}
                ché la diritta via era smarrita...
              </div>
            ) : (
              <iframe
                src={`/pages/${page.file}`}
                title={page.title}
                loading="lazy"
                tabIndex={-1}
              />
            )}
          </div>
          <div className="card-body">
            <span className={`card-tag ${page.tagClass}`}>{page.tag}</span>
            <div className="card-title">{page.title}</div>
            <div className="card-desc">{page.desc}</div>
          </div>
          <div className="card-footer">
            <span className="card-file">{page.file}</span>
            <span className="card-arrow">→</span>
          </div>
        </div>
      ))}
    </div>
  )
}
