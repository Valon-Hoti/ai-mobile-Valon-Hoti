import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import './Notifications.css'

export default function Notifications({ session }) {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    generateNotifications()
  }, [session])

  const generateNotifications = async () => {
    try {
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select(`
          *,
          courses (name, color)
        `)
        .eq('user_id', session.user.id)
        .eq('completed', false)
        .order('due_date', { ascending: true })

      if (error) throw error

      const now = new Date()
      const notifs = []

      tasks?.forEach(task => {
        const dueDate = new Date(task.due_date)
        const diffTime = dueDate - now
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        let shouldNotify = false
        let message = ''
        let urgency = 'normal'

        if (task.type === 'provim' || task.type === 'kolokvium') {
          if (diffDays <= 3 && diffDays >= 0) {
            shouldNotify = true
            if (diffDays === 0) {
              message = `${task.type === 'provim' ? 'Provimi' : 'Kolokviumi'} "${task.title}" është sot!`
              urgency = 'high'
            } else if (diffDays === 1) {
              message = `${task.type === 'provim' ? 'Provimi' : 'Kolokviumi'} "${task.title}" është nesër!`
              urgency = 'high'
            } else {
              message = `${task.type === 'provim' ? 'Provimi' : 'Kolokviumi'} "${task.title}" është në ${diffDays} ditë`
              urgency = 'medium'
            }
          }
        } else if (task.type === 'projekt') {
          if (diffDays <= 2 && diffDays >= 0) {
            shouldNotify = true
            if (diffDays === 0) {
              message = `Projekti "${task.title}" duhet dorëzuar sot!`
              urgency = 'high'
            } else if (diffDays === 1) {
              message = `Projekti "${task.title}" duhet dorëzuar nesër!`
              urgency = 'high'
            } else {
              message = `Projekti "${task.title}" duhet dorëzuar në ${diffDays} ditë`
              urgency = 'medium'
            }
          }
        } else if (task.type === 'prezantim') {
          if (diffDays <= 1 && diffDays >= 0) {
            shouldNotify = true
            if (diffDays === 0) {
              message = `Prezantimi "${task.title}" është sot!`
              urgency = 'high'
            } else {
              message = `Prezantimi "${task.title}" është nesër!`
              urgency = 'high'
            }
          }
        }

        if (diffDays < 0) {
          shouldNotify = true
          message = `"${task.title}" ka kaluar afatin!`
          urgency = 'overdue'
        }

        if (shouldNotify) {
          notifs.push({
            id: task.id,
            message,
            urgency,
            task,
            dueDate: task.due_date
          })
        }
      })

      setNotifications(notifs)
    } catch (error) {
      console.error('Error generating notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const getUrgencyColor = (urgency) => {
    const colors = {
      high: '#ef4444',
      medium: '#f59e0b',
      normal: '#3b82f6',
      overdue: '#dc2626'
    }
    return colors[urgency] || colors.normal
  }

  const getUrgencyIcon = (urgency) => {
    const icons = {
      high: '🔴',
      medium: '🟡',
      normal: '🔵',
      overdue: '⚠️'
    }
    return icons[urgency] || icons.normal
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('sq-AL', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    })
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h1>Njoftimet 🔔</h1>
        <p className="notifications-subtitle">
          Sistemi juaj i alertave automatike për afatet e rëndësishme
        </p>
      </div>

      <div className="alert-info">
        <h3>📢 Sistemi i Njoftimeve</h3>
        <ul>
          <li>🔴 Provime & Kolokviume: Njoftime 3 ditë përpara</li>
          <li>🟡 Projekte: Njoftime 2 ditë përpara</li>
          <li>🔵 Prezantime: Njoftime 1 ditë përpara</li>
          <li>⚠️ Afate të kaluara: Shfaqen me prioritet</li>
        </ul>
      </div>

      {notifications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">✅</div>
          <h2>Nuk ka njoftime të reja!</h2>
          <p>Të gjitha afatet janë në kontroll. Vazhdoni ashtu! 🎉</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map(notif => (
            <div 
              key={notif.id} 
              className="notification-card"
              style={{ borderLeftColor: getUrgencyColor(notif.urgency) }}
            >
              <div className="notification-header">
                <span className="urgency-icon">{getUrgencyIcon(notif.urgency)}</span>
                <span className="task-type-icon">{getTaskTypeIcon(notif.task.type)}</span>
              </div>
              
              <h3 className="notification-message">{notif.message}</h3>
              
              <div className="notification-details">
                {notif.task.courses && (
                  <div className="notification-course" style={{ color: notif.task.courses.color }}>
                    📖 {notif.task.courses.name}
                  </div>
                )}
                <div className="notification-date">
                  📅 {formatDate(notif.dueDate)}
                </div>
              </div>

              {notif.task.description && (
                <p className="notification-description">{notif.task.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
