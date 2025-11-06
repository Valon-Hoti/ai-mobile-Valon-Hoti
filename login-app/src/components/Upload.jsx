import { useState } from 'react'
import { supabase } from '../supabaseClient'
import './Upload.css'

export default function Upload({ session }) {
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState(null)
  const [error, setError] = useState(null)

  const handleFileUpload = async (event) => {
    try {
      setError(null)
      setUploading(true)

      const file = event.target.files[0]
      if (!file) return

      if (!file.type.startsWith('image/')) {
        setError('Ju lutem zgjidhni një imazh')
        setUploading(false)
        return
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `${session.user.id}/${Math.random()}.${fileExt}`

      const { data, error: uploadError } = await supabase.storage
        .from('user_uploads')
        .upload(fileName, file)

      if (uploadError) {
        throw uploadError
      }

      const { data: urlData } = supabase.storage
        .from('user_uploads')
        .getPublicUrl(data.path)

      setUploadedUrl(urlData.publicUrl)
    } catch (error) {
      setError(error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="upload-container">
      <div className="upload-header">
        <h1>Ngarko Imazh</h1>
        <p>Zgjidhni një imazh për ta ngarkuar në Supabase Storage</p>
      </div>

      <div className="upload-section">
        <label htmlFor="file-upload" className="upload-label">
          <span className="upload-icon">📁</span>
          <span>{uploading ? 'Duke ngarkuar...' : 'Zgjidhni një imazh'}</span>
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={uploading}
          style={{ display: 'none' }}
        />
      </div>

      {error && (
        <div className="error-message">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {uploadedUrl && (
        <div className="uploaded-section">
          <h2>Imazhi u ngarkua me sukses! ✅</h2>
          <div className="image-preview">
            <img src={uploadedUrl} alt="Uploaded" />
          </div>
          <div className="url-section">
            <p className="url-label">Public URL:</p>
            <code className="url-code">{uploadedUrl}</code>
          </div>
        </div>
      )}
    </div>
  )
}
