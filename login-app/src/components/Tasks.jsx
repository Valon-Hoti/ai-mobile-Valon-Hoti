import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import './Tasks.css'

export default function Tasks({ session }) {
  const [tasks, setTasks] = useState([])
  const [courses, setCourses] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'provim',
    course_id: '',
    due_date: '',
    due_time: '12:00'
  })
  const [editingId, setEditingId] = useState(null)
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  const taskTypes = [
    { value: 'provim', label: 'Provim', icon: '📝', color: '#ef4444' },
    { value: 'kolokvium', label: 'Kolokvium', icon: '📋', color: '#f59e0b' },
    { value: 'projekt', label: 'Projekt', icon: '💼', color: '#3b82f6' },
    { value: 'prezantim', label: 'Prezantim', icon: '🎤', color: '#8b5cf6' }
  ]

  useEffect(() => {
    fetchCourses()
    fetchTasks()
  }, [session])

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('user_id', session.user.id)

      if (error) throw error
      setCourses(data || [])
    } catch (error) {
      console.error('Error fetching courses:', error)
    }
  }

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
      setTasks(data || [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const dueDateTime = `${formData.due_date}T${formData.due_time}:00`

    try {
      const taskData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        course_id: formData.course_id || null,
        due_date: dueDateTime,
        user_id: session.user.id
      }

      if (editingId) {
        const { error } = await supabase
          .from('tasks')
          .update(taskData)
          .eq('id', editingId)
          .eq('user_id', session.user.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('tasks')
          .insert([taskData])

        if (error) throw error
      }

      setFormData({
        title: '',
        description: '',
        type: 'provim',
        course_id: '',
        due_date: '',
        due_time: '12:00'
      })
      setShowForm(false)
      setEditingId(null)
      fetchTasks()
    } catch (error) {
      console.error('Error saving task:', error)
      alert('Ka ndodhur një gabim. Ju lutemi provoni përsëri.')
    }
  }

  const handleEdit = (task) => {
    const dueDate = new Date(task.due_date)
    setFormData({
      title: task.title,
      description: task.description || '',
      type: task.type,
      course_id: task.course_id || '',
      due_date: dueDate.toISOString().split('T')[0],
      due_time: dueDate.toTimeString().slice(0, 5)
    })
    setEditingId(task.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('A jeni i sigurt që dëshironi të fshini këtë detyrë?')) return

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id)

      if (error) throw error
      fetchTasks()
    } catch (error) {
      console.error('Error deleting task:', error)
      alert('Ka ndodhur një gabim gjatë fshirjes.')
    }
  }

  const toggleComplete = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !currentStatus })
        .eq('id', id)
        .eq('user_id', session.user.id)

      if (error) throw error
      fetchTasks()
    } catch (error) {
      console.error('Error updating task:', error)
    }
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

  const getFilteredTasks = () => {
    if (filter === 'all') return tasks
    if (filter === 'completed') return tasks.filter(t => t.completed)
    if (filter === 'pending') return tasks.filter(t => !t.completed)
    return tasks.filter(t => t.type === filter)
  }

  const getTaskTypeInfo = (type) => {
    return taskTypes.find(t => t.value === type) || taskTypes[0]
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    )
  }

  const filteredTasks = getFilteredTasks()

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h1>Detyrat & Provimet ✏️</h1>
        <button 
          className="btn-primary"
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
            setFormData({
              title: '',
              description: '',
              type: 'provim',
              course_id: '',
              due_date: '',
              due_time: '12:00'
            })
          }}
        >
          {showForm ? 'Anulo' : '+ Shto Detyrë'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label>Titulli *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="p.sh. Provimi Final i Matematikës"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Lloji *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              >
                {taskTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Lënda</label>
              <select
                value={formData.course_id}
                onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
              >
                <option value="">Zgjidh lëndën (opsionale)</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Data *</label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Ora *</label>
              <input
                type="time"
                value={formData.due_time}
                onChange={(e) => setFormData({ ...formData, due_time: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Përshkrim</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Shto detaje shtesë..."
              rows="3"
            />
          </div>

          <button type="submit" className="btn-submit">
            {editingId ? 'Përditëso' : 'Shto Detyrën'}
          </button>
        </form>
      )}

      <div className="filter-bar">
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          Të gjitha
        </button>
        <button 
          className={filter === 'pending' ? 'active' : ''}
          onClick={() => setFilter('pending')}
        >
          Në pritje
        </button>
        <button 
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Të përfunduara
        </button>
        {taskTypes.map(type => (
          <button
            key={type.value}
            className={filter === type.value ? 'active' : ''}
            onClick={() => setFilter(type.value)}
          >
            {type.icon} {type.label}
          </button>
        ))}
      </div>

      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          <p>Nuk ka detyra për këtë filtër.</p>
        </div>
      ) : (
        <div className="tasks-list">
          {filteredTasks.map(task => {
            const typeInfo = getTaskTypeInfo(task.type)
            return (
              <div 
                key={task.id} 
                className={`task-item ${task.completed ? 'completed' : ''}`}
                style={{ borderLeftColor: typeInfo.color }}
              >
                <div className="task-item-header">
                  <div className="task-type-badge" style={{ backgroundColor: typeInfo.color }}>
                    <span>{typeInfo.icon}</span>
                    <span>{typeInfo.label}</span>
                  </div>
                  <div className="task-item-actions">
                    <button onClick={() => toggleComplete(task.id, task.completed)} className="btn-check">
                      {task.completed ? '✓' : '○'}
                    </button>
                    <button onClick={() => handleEdit(task)} className="btn-icon">
                      ✏️
                    </button>
                    <button onClick={() => handleDelete(task.id)} className="btn-icon">
                      🗑️
                    </button>
                  </div>
                </div>
                <h3 className="task-item-title">{task.title}</h3>
                <div className="task-item-meta">
                  <span className="task-date">📅 {formatDate(task.due_date)}</span>
                  {task.courses && (
                    <span className="task-course-badge" style={{ color: task.courses.color }}>
                      📖 {task.courses.name}
                    </span>
                  )}
                </div>
                {task.description && (
                  <p className="task-item-description">{task.description}</p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
