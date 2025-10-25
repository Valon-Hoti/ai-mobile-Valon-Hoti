import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import './Schedule.css'

export default function Schedule({ session }) {
  const [schedule, setSchedule] = useState([])
  const [courses, setCourses] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    course_id: '',
    day_of_week: 1,
    start_time: '09:00',
    end_time: '10:00',
    room: ''
  })
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)

  const daysOfWeek = [
    { value: 1, label: 'E Hënë' },
    { value: 2, label: 'E Martë' },
    { value: 3, label: 'E Mërkurë' },
    { value: 4, label: 'E Enjte' },
    { value: 5, label: 'E Premte' },
    { value: 6, label: 'E Shtunë' },
    { value: 0, label: 'E Diel' }
  ]

  useEffect(() => {
    fetchCourses()
    fetchSchedule()
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

  const fetchSchedule = async () => {
    try {
      const { data, error } = await supabase
        .from('schedule')
        .select(`
          *,
          courses (name, color, professor)
        `)
        .eq('user_id', session.user.id)
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true })

      if (error) throw error
      setSchedule(data || [])
    } catch (error) {
      console.error('Error fetching schedule:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const scheduleData = {
        ...formData,
        user_id: session.user.id
      }

      if (editingId) {
        const { error } = await supabase
          .from('schedule')
          .update(scheduleData)
          .eq('id', editingId)
          .eq('user_id', session.user.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('schedule')
          .insert([scheduleData])

        if (error) throw error
      }

      setFormData({
        course_id: '',
        day_of_week: 1,
        start_time: '09:00',
        end_time: '10:00',
        room: ''
      })
      setShowForm(false)
      setEditingId(null)
      fetchSchedule()
    } catch (error) {
      console.error('Error saving schedule:', error)
      alert('Ka ndodhur një gabim. Ju lutemi provoni përsëri.')
    }
  }

  const handleEdit = (item) => {
    setFormData({
      course_id: item.course_id,
      day_of_week: item.day_of_week,
      start_time: item.start_time,
      end_time: item.end_time,
      room: item.room || ''
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('A jeni i sigurt që dëshironi të fshini këtë orë?')) return

    try {
      const { error } = await supabase
        .from('schedule')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id)

      if (error) throw error
      fetchSchedule()
    } catch (error) {
      console.error('Error deleting schedule:', error)
      alert('Ka ndodhur një gabim gjatë fshirjes.')
    }
  }

  const getScheduleByDay = (dayValue) => {
    return schedule.filter(item => item.day_of_week === dayValue)
  }

  const getDayLabel = (dayValue) => {
    return daysOfWeek.find(d => d.value === dayValue)?.label || ''
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="schedule-container">
      <div className="schedule-header">
        <h1>Orari Javor 📅</h1>
        <button 
          className="btn-primary"
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
            setFormData({
              course_id: '',
              day_of_week: 1,
              start_time: '09:00',
              end_time: '10:00',
              room: ''
            })
          }}
        >
          {showForm ? 'Anulo' : '+ Shto Orë'}
        </button>
      </div>

      {courses.length === 0 && (
        <div className="info-banner">
          ℹ️ Fillimisht duhet të shtoni lëndët tuaja për të krijuar orarin.
        </div>
      )}

      {showForm && courses.length > 0 && (
        <form onSubmit={handleSubmit} className="schedule-form">
          <div className="form-group">
            <label>Lënda *</label>
            <select
              value={formData.course_id}
              onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
              required
            >
              <option value="">Zgjidh lëndën</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Dita *</label>
            <select
              value={formData.day_of_week}
              onChange={(e) => setFormData({ ...formData, day_of_week: parseInt(e.target.value) })}
              required
            >
              {daysOfWeek.map(day => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Ora e fillimit *</label>
              <input
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Ora e mbarimit *</label>
              <input
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Salla/Dhoma</label>
            <input
              type="text"
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              placeholder="p.sh. Salla 101, Amfiteatri A..."
            />
          </div>

          <button type="submit" className="btn-submit">
            {editingId ? 'Përditëso' : 'Shto në Orar'}
          </button>
        </form>
      )}

      {schedule.length === 0 ? (
        <div className="empty-state">
          <p>Nuk keni shtuar asnjë orë në orar ende.</p>
          <p>Klikoni "Shto Orë" për të filluar!</p>
        </div>
      ) : (
        <div className="schedule-grid">
          {daysOfWeek.map(day => {
            const daySchedule = getScheduleByDay(day.value)
            if (daySchedule.length === 0) return null

            return (
              <div key={day.value} className="day-column">
                <h2 className="day-header">{day.label}</h2>
                <div className="day-schedule">
                  {daySchedule.map(item => (
                    <div 
                      key={item.id} 
                      className="schedule-item"
                      style={{ borderLeftColor: item.courses?.color }}
                    >
                      <div className="schedule-item-header">
                        <div 
                          className="course-badge"
                          style={{ backgroundColor: item.courses?.color }}
                        >
                          📚 {item.courses?.name}
                        </div>
                        <div className="schedule-actions">
                          <button onClick={() => handleEdit(item)} className="btn-icon">
                            ✏️
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="btn-icon">
                            🗑️
                          </button>
                        </div>
                      </div>
                      <div className="schedule-time">
                        🕐 {item.start_time.slice(0, 5)} - {item.end_time.slice(0, 5)}
                      </div>
                      {item.room && (
                        <div className="schedule-room">
                          📍 {item.room}
                        </div>
                      )}
                      {item.courses?.professor && (
                        <div className="schedule-professor">
                          👨‍🏫 {item.courses.professor}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
