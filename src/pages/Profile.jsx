import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      const { data } = await supabase.auth.getUser()
      const user = data.user
      if (!user) return
      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (!mounted) return
      setProfile(p)
      setLoading(false)
    }
    load()
    return () => (mounted = false)
  }, [])

  if (loading) return <p>Loading profile...</p>
  if (!profile) return <p>No profile found — contact the admin.</p>

  return (
    <div style={{ padding: 20 }}>
      <h2>Profile</h2>
      <p><strong>Display name:</strong> {profile.display_name}</p>
      <p><strong>First name:</strong> {profile.first_name}</p>
      <p><strong>Last name:</strong> {profile.last_name}</p>
      <p><strong>Team:</strong> {profile.team_id || 'Not assigned'}</p>
      <p><strong>Avatar:</strong></p>
      {profile.avatar_url ? <img src={profile.avatar_url} alt="avatar" width={120} /> : <p>No avatar</p>}
    </div>
  )
}
