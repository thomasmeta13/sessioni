import { useState } from 'react'

const tabs = ['Overview', 'Research', 'Options', 'Notes']

const typeIcons = {
  paper: '📄',
  article: '📰',
  guide: '🛠',
  video: '🎥',
  link: '🔗',
}

export default function GoalDetail({ goal, onBack }) {
  const [activeTab, setActiveTab] = useState('Overview')

  return (
    <div className="viewer">
      <div className="viewer-bar">
        <button className="viewer-back" onClick={onBack}>
          ← Back
        </button>
        <span className="viewer-title">{goal.title}</span>
        <span
          className="goal-detail-status"
          style={{
            background: 'rgba(99,102,241,0.15)',
            color: '#818cf8',
          }}
        >
          {goal.status}
        </span>
        {goal.budget && <span className="viewer-file">{goal.budget}</span>}
      </div>

      <div className="goal-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`goal-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="goal-content">
        {activeTab === 'Overview' && (
          <div className="goal-overview">
            <div className="go-section">
              <h3>What is it?</h3>
              <p>{goal.overview?.what}</p>
            </div>

            {goal.overview?.wavelengths && (
              <div className="go-section">
                <h3>Key Wavelengths</h3>
                <div className="go-wavelengths">
                  {goal.overview.wavelengths.map((w) => (
                    <div key={w.nm} className="go-wl-card">
                      <div className="go-wl-nm">{w.nm}</div>
                      <div className="go-wl-type">{w.type}</div>
                      <div className="go-wl-depth">{w.depth}</div>
                      <div className="go-wl-for">{w.best_for}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="go-section">
              <h3>Science Status</h3>
              <p>{goal.overview?.science_status}</p>
            </div>

            {goal.overview?.key_metric && (
              <div className="go-highlight">
                {goal.overview.key_metric}
              </div>
            )}

            {goal.considerations && (
              <div className="go-section">
                <h3>Key Considerations</h3>
                <div className="go-considerations">
                  {goal.considerations.map((c) => (
                    <div key={c.label} className="go-consideration">
                      <span className="go-c-label">{c.label}</span>
                      <span className="go-c-detail">{c.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {goal.overview?.bottom_line && (
              <div className="go-bottomline">
                <strong>Bottom line:</strong> {goal.overview.bottom_line}
              </div>
            )}
          </div>
        )}

        {activeTab === 'Research' && (
          <div className="goal-research">
            <div className="gr-count">{goal.research?.length || 0} sources</div>
            <div className="gr-list">
              {goal.research?.map((r, i) => (
                <div key={i} className="gr-item">
                  <div className="gr-icon">{typeIcons[r.type] || '📄'}</div>
                  <div className="gr-body">
                    <div className="gr-title">
                      {r.url ? (
                        <a href={r.url} target="_blank" rel="noopener noreferrer">
                          {r.title}
                        </a>
                      ) : (
                        r.title
                      )}
                    </div>
                    <div className="gr-meta">
                      {r.authors && <span>{r.authors}</span>}
                      {r.year && <span>{r.year}</span>}
                      {r.journal && <span>{r.journal}</span>}
                    </div>
                    <div className="gr-finding">{r.finding}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Options' && goal.options && (
          <div className="goal-options">
            <div className="go-table-wrap">
              <table className="go-table">
                <thead>
                  <tr>
                    <th></th>
                    {goal.options.columns.map((col) => (
                      <th key={col.name}>
                        {col.emoji && <span className="go-col-emoji">{col.emoji}</span>}
                        {col.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {goal.options.criteria.map((criterion, i) => (
                    <tr key={criterion}>
                      <td className="go-criteria">{criterion}</td>
                      {goal.options.columns.map((col) => (
                        <td key={col.name}>{col.values[i]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Notes' && (
          <div className="goal-notes">
            <pre>{goal.notes || 'No notes yet.'}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
