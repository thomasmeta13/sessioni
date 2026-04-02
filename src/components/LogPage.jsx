import { useState, useEffect, useRef } from 'react'

const typeStyles = {
  user_prompt: { label: 'Chat', color: '#6366f1' },
  assistant_response: { label: 'Response', color: '#34d399' },
  tool_use: { label: 'Tool', color: '#f59e0b' },
  tool_result: { label: 'Result', color: '#a78bfa' },
  task_created: { label: 'Task', color: '#38bdf8' },
  task_updated: { label: 'Task', color: '#38bdf8' },
  intermediate: { label: 'Event', color: '#64748b' },
  error: { label: 'Error', color: '#f87171' },
}

function formatTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function formatDate(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

export default function LogPage() {
  const [events, setEvents] = useState([])
  const [filter, setFilter] = useState('all')
  const [live, setLive] = useState(true)
  const bottomRef = useRef(null)

  // Fetch history on mount
  useEffect(() => {
    fetch('http://localhost:4444/history')
      .then(r => r.json())
      .then(data => setEvents(data.events || []))
      .catch(() => {})
  }, [])

  // SSE for live events
  useEffect(() => {
    if (!live) return
    const es = new EventSource('http://localhost:4444/events')
    es.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data)
        setEvents(prev => [...prev.slice(-199), event])
      } catch {}
    }
    return () => es.close()
  }, [live])

  // Auto-scroll
  useEffect(() => {
    if (live && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [events, live])

  const filtered = filter === 'all'
    ? events
    : events.filter(e => e.type === filter)

  const uniqueTypes = [...new Set(events.map(e => e.type))]

  return (
    <div className="log-page">
      <div className="log-toolbar">
        <div className="log-filters">
          <button
            className={`log-filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({events.length})
          </button>
          {uniqueTypes.map(type => {
            const style = typeStyles[type] || typeStyles.intermediate
            const count = events.filter(e => e.type === type).length
            return (
              <button
                key={type}
                className={`log-filter-btn ${filter === type ? 'active' : ''}`}
                onClick={() => setFilter(type)}
              >
                {style.label} ({count})
              </button>
            )
          })}
        </div>
        <button
          className={`log-live-btn ${live ? 'active' : ''}`}
          onClick={() => setLive(!live)}
        >
          {live ? 'Live' : 'Paused'}
        </button>
      </div>

      <div className="log-list">
        {filtered.length === 0 && (
          <div className="log-empty">
            No events yet. Events will appear here as the system runs.
          </div>
        )}
        {filtered.map((event, i) => {
          const style = typeStyles[event.type] || typeStyles.intermediate
          return (
            <div key={event.id || i} className="log-entry">
              <div className="log-time">
                <span className="log-date">{formatDate(event.timestamp)}</span>
                <span>{formatTime(event.timestamp)}</span>
              </div>
              <div className="log-badge" style={{ background: style.color + '22', color: style.color }}>
                {style.label}
              </div>
              <div className="log-session">{event.session || '—'}</div>
              <div className="log-message">
                {event.message || '—'}
                {event.tool && (
                  <span className="log-tool">{event.tool}</span>
                )}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
