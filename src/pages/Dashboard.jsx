import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Dashboard({ session }) {
  const [user, setUser] = useState(null)

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

  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard</h2>
      {user ? (
        <div>
          <p>Signed in as: {user.email}</p>
          <button onClick={signOut}>Sign out</button>
        </div>
      ) : (
        <p>Loading user...</p>
      )}
    </div>
  )
}
