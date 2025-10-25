import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import './Courses.css'

export default function Courses({ session }) {
  const [courses, setCourses] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    professor: '',
    color: '#6366f1'
  })
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)

  const colors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
    '#f59e0b', '#10b981', '#3b82f6', '#06b6d4'
  ]

  useEffect(() => {
    fetchCourses()
  }, [session])

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: true })

      if (error) throw error
      setCourses(data || [])
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (editingId) {
        const { error } = await supabase
          .from('courses')
          .update(formData)
          .eq('id', editingId)
          .eq('user_id', session.user.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('courses')
          .insert([{ ...formData, user_id: session.user.id }])

        if (error) throw error
      }

      setFormData({ name: '', professor: '', color: '#6366f1' })
      setShowForm(false)
      setEditingId(null)
      fetchCourses()
    } catch (error) {
      console.error('Error saving course:', error)
      alert('Ka ndodhur një gabim. Ju lutemi provoni përsëri.')
    }
  }

  const handleEdit = (course) => {
    setFormData({
      name: course.name,
      professor: course.professor || '',
      color: course.color
    })
    setEditingId(course.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('A jeni i sigurt që dëshironi të fshini këtë lëndë?')) return

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id)

      if (error) throw error
      fetchCourses()
    } catch (error) {
      console.error('Error deleting course:', error)
      alert('Ka ndodhur një gabim gjatë fshirjes.')
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="courses-container">
      <div className="courses-header">
        <h1>Lëndët e mia 📖</h1>
        <button 
          className="btn-primary"
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
            setFormData({ name: '', professor: '', color: '#6366f1' })
          }}
        >
          {showForm ? 'Anulo' : '+ Shto Lëndë'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="course-form">
          <div className="form-group">
            <label>Emri i Lëndës *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="p.sh. Matematikë, Fizikë..."
              required
            />
          </div>

          <div className="form-group">
            <label>Profesori</label>
            <input
              type="text"
              value={formData.professor}
              onChange={(e) => setFormData({ ...formData, professor: e.target.value })}
              placeholder="Emri i profesorit"
            />
          </div>

          <div className="form-group">
            <label>Ngjyra</label>
            <div className="color-picker">
              {colors.map(color => (
                <button
                  key={color}
                  type="button"
                  className={`color-option ${formData.color === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData({ ...formData, color })}
                />
              ))}
            </div>
          </div>

          <button type="submit" className="btn-submit">
            {editingId ? 'Përditëso' : 'Shto Lëndën'}
          </button>
        </form>
      )}

      {courses.length === 0 ? (
        <div className="empty-state">
          <p>Nuk keni shtuar asnjë lëndë ende.</p>
          <p>Klikoni "Shto Lëndë" për të filluar!</p>
        </div>
      ) : (
        <div className="courses-grid">
          {courses.map(course => (
            <div 
              key={course.id} 
              className="course-card"
              style={{ borderTopColor: course.color }}
            >
              <div className="course-header">
                <div 
                  className="course-icon"
                  style={{ backgroundColor: course.color }}
                >
                  📚
                </div>
                <div className="course-actions">
                  <button onClick={() => handleEdit(course)} className="btn-icon">
                    ✏️
                  </button>
                  <button onClick={() => handleDelete(course.id)} className="btn-icon">
                    🗑️
                  </button>
                </div>
              </div>
              <h3 className="course-name">{course.name}</h3>
              {course.professor && (
                <p className="course-professor">👨‍🏫 {course.professor}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
