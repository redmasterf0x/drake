import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Articles() {
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

  if (loading) return <p>Loading...</p>
  if (!profile || !profile.team_id) return <p>You are not part of a team yet — contact the admin to be added.</p>

  return (
    <div style={{ padding: 20 }}>
      <h2>Articles</h2>
      <p>Articles will appear here for your team.</p>
    </div>
  )
}
