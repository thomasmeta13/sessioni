import { useState, useEffect } from 'react'
import GoalDetail from './GoalDetail'

const statusColors = {
  researching: { bg: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' },
  decided: { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399' },
  purchased: { bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' },
  abandoned: { bg: 'rgba(107, 114, 128, 0.15)', color: '#9ca3af' },
}

export default function GoalsPage() {
  const [goals, setGoals] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetch('/goals/index.json')
      .then((r) => r.json())
      .then(async (manifest) => {
        const loaded = await Promise.all(
          manifest.goals.map((g) =>
            fetch(`/goals/${g.file}`).then((r) => r.json())
          )
        )
        setGoals(loaded)
      })
  }, [])

  if (selected) {
    return <GoalDetail goal={selected} onBack={() => setSelected(null)} />
  }

  return (
    <div className="nav-grid">
      {goals.map((goal) => {
        const sc = statusColors[goal.status] || statusColors.researching
        return (
          <div key={goal.id} className="nav-card" onClick={() => setSelected(goal)}>
            <div className="goal-card-hero">
              <div className="goal-card-icon">
                {goal.tag === 'Health' ? '🔴' : '🎯'}
              </div>
              <div
                className="goal-status-pill"
                style={{ background: sc.bg, color: sc.color }}
              >
                {goal.status}
              </div>
            </div>
            <div className="card-body">
              <span className={`card-tag ${goal.tagClass}`}>{goal.tag}</span>
              <div className="card-title">{goal.title}</div>
              <div className="card-desc">{goal.summary}</div>
              {goal.budget && (
                <div className="goal-meta">
                  <span>Budget: {goal.budget}</span>
                  {goal.updated && <span>Updated: {goal.updated}</span>}
                </div>
              )}
            </div>
            <div className="card-footer">
              <span className="card-file">
                {goal.research?.length || 0} sources · {goal.options?.columns?.length || 0} options
              </span>
              <span className="card-arrow">→</span>
            </div>
          </div>
        )
      })}

      {goals.length === 0 && (
        <div className="goals-empty">Loading goals...</div>
      )}
    </div>
  )
}
