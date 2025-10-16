import { supabase } from '../supabaseClient'
import './Home.css'

export default function Home({ session }) {
  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="home-container">
      <div className="home-card">
        <div className="home-header">
          <h1>Welcome!</h1>
          <p>You're successfully logged in</p>
        </div>

        <div className="user-info">
          <div className="info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">{session.user.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">User ID:</span>
            <span className="info-value">{session.user.id}</span>
          </div>
        </div>

        <button onClick={handleSignOut} className="btn-secondary">
          Sign Out
        </button>
      </div>
    </div>
  )
}
