import { useState } from 'react'
import ProjectsPage from './components/ProjectsPage'
import GoalsPage from './components/GoalsPage'
import LogPage from './components/LogPage'
import './App.css'
import './styles/Goals.css'

const navItems = [
  { id: 'goals', label: 'Goals' },
  { id: 'projects', label: 'Projects' },
  { id: 'log', label: 'Log' },
]

function App() {
  const [currentPage, setCurrentPage] = useState('goals')

  const subtitles = { goals: 'Goal Tracker', projects: 'Project Navigator', log: 'Activity Log' }
  const subtitle = subtitles[currentPage] || ''

  return (
    <div className="navigator">
      <header className="nav-header">
        <div className="nav-brand">
          <div>
            <div className="logo">ikigai</div>
            <div className="subtitle">{subtitle}</div>
          </div>
        </div>
        <nav className="nav-tabs">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-tab ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => setCurrentPage(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      {currentPage === 'projects' && <ProjectsPage />}
      {currentPage === 'goals' && <GoalsPage />}
      {currentPage === 'log' && <LogPage />}
    </div>
  )
}

export default App
