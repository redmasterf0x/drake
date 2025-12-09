import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Dashboard({ session }) {
  const [user, setUser] = useState(null)
  const [uploading, setUploading] = useState(false)

  function avatarUrlFromUser(u) {
    return u?.user_metadata?.avatar_url || u?.user_metadata?.avatar || ''
  }

  useEffect(() => {
    let mounted = true
    async function load() {
      if (session?.user) {
        setUser(session.user)
      } else {
        const { data } = await supabase.auth.getUser()
        if (!mounted) return
        setUser(data.user)
      }
    }
    load()
    return () => (mounted = false)
  }, [session])

  async function signOut() {
    await supabase.auth.signOut()
    window.location.href = '/signin'
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!user) return

    const path = `avatars/${user.id}/${Date.now()}_${file.name}`
    try {
      setUploading(true)
      const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)
      const publicUrl = urlData?.publicUrl || ''

      // Save avatar URL to user metadata
      await supabase.auth.updateUser({ data: { avatar_url: publicUrl } })

      // Refresh user info
      const { data: refreshed } = await supabase.auth.getUser()
      setUser(refreshed.user)
    } catch (err) {
      console.error('Upload error', err)
      alert('Failed to upload avatar: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard</h2>
      {user ? (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div>
              {avatarUrlFromUser(user) ? (
                <img src={avatarUrlFromUser(user)} alt="avatar" width={72} height={72} style={{ borderRadius: 8 }} />
              ) : (
                <div style={{ width: 72, height: 72, background: '#ddd', borderRadius: 8 }} />
              )}
            </div>
            <div>
              <p style={{ margin: 0 }}>{user.user_metadata?.display_name || user.email}</p>
              <p style={{ margin: 0, fontSize: 12, color: '#666' }}>{user.email}</p>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <label>
              Upload profile picture:{' '}
              <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
            </label>
          </div>

          <div style={{ marginTop: 12 }}>
            <button onClick={signOut}>Sign out</button>
          </div>
        </div>
      ) : (
        <p>Loading user...</p>
      )}
    </div>
  )
}
