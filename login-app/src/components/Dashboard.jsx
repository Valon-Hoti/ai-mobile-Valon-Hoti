import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import './Dashboard.css'

export default function Dashboard({ session, onNavigate }) {
  const [tasks, setTasks] = useState([])
  const [upcomingTasks, setUpcomingTasks] = useState([])
  const [stats, setStats] = useState({ total: 0, completed: 0, upcoming: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [session])

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          courses (name, color)
        `)
        .eq('user_id', session.user.id)
        .order('due_date', { ascending: true })

      if (error) throw error

      const now = new Date()
      const next7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

      const upcoming = data?.filter(task => {
        const dueDate = new Date(task.due_date)
        return !task.completed && dueDate >= now && dueDate <= next7Days
      }) || []

      const completed = data?.filter(task => task.completed).length || 0

      setTasks(data || [])
      setUpcomingTasks(upcoming)
      setStats({
        total: data?.length || 0,
        completed: completed,
        upcoming: upcoming.length
      })
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleTaskComplete = async (taskId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !currentStatus })
        .eq('id', taskId)
        .eq('user_id', session.user.id)

      if (error) throw error
      fetchTasks()
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const getTaskTypeIcon = (type) => {
    const icons = {
      provim: '📝',
      kolokvium: '📋',
      projekt: '💼',
      prezantim: '🎤'
    }
    return icons[type] || '📌'
  }

  const getTaskTypeColor = (type) => {
    const colors = {
      provim: '#ef4444',
      kolokvium: '#f59e0b',
      projekt: '#3b82f6',
      prezantim: '#8b5cf6'
    }
    return colors[type] || '#6366f1'
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = date - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Sot'
    if (diffDays === 1) return 'Nesër'
    if (diffDays < 0) return 'Kaluar'
    if (diffDays <= 7) return `${diffDays} ditë`
    
    return date.toLocaleDateString('sq-AL', { day: 'numeric', month: 'short' })
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Mirë se vjen në UniTrack! 🎓</h1>
        <p className="dashboard-subtitle">Organizoni dhe menaxhoni studimet tuaja</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Totali Detyrave</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.completed}</h3>
            <p>Të Përfunduara</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <h3>{stats.upcoming}</h3>
            <p>Javën e Ardhshme</p>
          </div>
        </div>
      </div>

      {upcomingTasks.length > 0 && (
        <div className="section">
          <h2>Afatet që Afrojnë 📌</h2>
          <div className="tasks-list">
            {upcomingTasks.map(task => (
              <div 
                key={task.id} 
                className="task-card"
                style={{ borderLeftColor: getTaskTypeColor(task.type) }}
              >
                <div className="task-header">
                  <div className="task-type">
                    <span className="task-icon">{getTaskTypeIcon(task.type)}</span>
                    <span className="task-type-label">{task.type}</span>
                  </div>
                  <span className="task-due-badge">{formatDate(task.due_date)}</span>
                </div>
                <h3 className="task-title">{task.title}</h3>
                {task.courses && (
                  <div className="task-course" style={{ color: task.courses.color }}>
                    {task.courses.name}
                  </div>
                )}
                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}
                <button 
                  onClick={() => toggleTaskComplete(task.id, task.completed)}
                  className="btn-complete"
                >
                  {task.completed ? '✓ Përfunduar' : 'Shëno si të përfunduar'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="quick-actions">
        <h2>Veprime të Shpejta</h2>
        <div className="action-buttons">
          <button className="action-btn" onClick={() => onNavigate('courses')}>
            <span className="action-icon">📖</span>
            <span>Lëndët e mia</span>
          </button>
          <button className="action-btn" onClick={() => onNavigate('tasks')}>
            <span className="action-icon">✏️</span>
            <span>Shto Detyrë</span>
          </button>
          <button className="action-btn" onClick={() => onNavigate('schedule')}>
            <span className="action-icon">📅</span>
            <span>Orari im</span>
          </button>
        </div>
      </div>
    </div>
  )
}
