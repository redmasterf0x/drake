import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Dashboard({ session }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        let authUser
        if (session?.user) {
          authUser = session.user
        } else {
          const { data } = await supabase.auth.getUser()
          authUser = data.user
        }
        if (!mounted) return
        setUser(authUser)

        // Load profile from profiles table
        if (authUser?.id) {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single()
          if (!error && profileData) {
            setProfile(profileData)
          }
        }
      } catch (err) {
        console.error('Failed to load user/profile', err)
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

      // Save avatar URL to profiles table
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
        .eq('id', user.id)
      if (updateError) throw updateError

      // Refresh profile info
      const { data: refreshed } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      if (refreshed) setProfile(refreshed)
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
      {user && profile ? (
        <div>
          <div style={{ marginBottom: 12 }}>
            <a href="/profile">Profile</a> · <a href="/articles">Articles</a> · <a href="/calendar">Calendar</a>
            {profile.is_admin ? <span> · <a href="/admin">Admin</a></span> : null}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div>
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="avatar" width={72} height={72} style={{ borderRadius: 8 }} />
              ) : (
                <div style={{ width: 72, height: 72, background: '#ddd', borderRadius: 8 }} />
              )}
            </div>
            <div>
              <p style={{ margin: 0 }}>
                {profile.display_name || `${profile.first_name} ${profile.last_name}`.trim() || user.email}
              </p>
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
        <p>Loading profile...</p>
      )}
    </div>
  )
}
