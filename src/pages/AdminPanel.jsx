import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function AdminPanel() {
  const [profile, setProfile] = useState(null)
  const [users, setUsers] = useState([])

  useEffect(() => {
    let mounted = true
    async function load() {
      const { data } = await supabase.auth.getUser()
      if (!data.user) return
      const { data: p } = await supabase.from('profiles').select('*').eq('id', data.user.id).single()
      if (!mounted) return
      setProfile(p)
      if (p?.is_admin) {
        // list profiles for admin
        const { data: all } = await supabase.from('profiles').select('*')
        setUsers(all || [])
      }
    }
    load()
    return () => (mounted = false)
  }, [])

  if (!profile) return <p>Loading...</p>
  if (!profile.is_admin) return <p>Access denied: admin only.</p>

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Panel</h2>
      <p>Manage teams and users here.</p>
      <h3>All Profiles</h3>
      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.display_name || u.email} — team: {u.team_id || '—'}</li>
        ))}
      </ul>
    </div>
  )
}
