import { useState } from 'react'
import { supabase } from '../supabaseClient'
import Dashboard from './Dashboard'
import Courses from './Courses'
import Tasks from './Tasks'
import Schedule from './Schedule'
import Notifications from './Notifications'
import './MainApp.css'

export default function MainApp({ session }) {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard session={session} onNavigate={setCurrentPage} />
      case 'courses':
        return <Courses session={session} />
      case 'tasks':
        return <Tasks session={session} />
      case 'schedule':
        return <Schedule session={session} />
      case 'notifications':
        return <Notifications session={session} />
      default:
        return <Dashboard session={session} onNavigate={setCurrentPage} />
    }
  }

  return (
    <div className="main-app">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <span className="brand-icon">🎓</span>
            <span className="brand-name">UniTrack</span>
          </div>

          <div className="nav-menu">
            <button 
              className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentPage('dashboard')}
            >
              <span className="nav-icon">🏠</span>
              <span className="nav-label">Dashboard</span>
            </button>

            <button 
              className={`nav-item ${currentPage === 'courses' ? 'active' : ''}`}
              onClick={() => setCurrentPage('courses')}
            >
              <span className="nav-icon">📖</span>
              <span className="nav-label">Lëndët</span>
            </button>

            <button 
              className={`nav-item ${currentPage === 'tasks' ? 'active' : ''}`}
              onClick={() => setCurrentPage('tasks')}
            >
              <span className="nav-icon">✏️</span>
              <span className="nav-label">Detyrat</span>
            </button>

            <button 
              className={`nav-item ${currentPage === 'schedule' ? 'active' : ''}`}
              onClick={() => setCurrentPage('schedule')}
            >
              <span className="nav-icon">📅</span>
              <span className="nav-label">Orari</span>
            </button>

            <button 
              className={`nav-item ${currentPage === 'notifications' ? 'active' : ''}`}
              onClick={() => setCurrentPage('notifications')}
            >
              <span className="nav-icon">🔔</span>
              <span className="nav-label">Njoftime</span>
            </button>
          </div>

          <div className="nav-user">
            <span className="user-email">{session.user.email}</span>
            <button onClick={handleSignOut} className="btn-signout">
              Dil
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  )
}
