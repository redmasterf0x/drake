import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './supabaseClient'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Confirm from './pages/Confirm'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    let mounted = true
    async function init() {
      const { data } = await supabase.auth.getSession()
      if (!mounted) return
      setSession(data.session)
    }
    init()

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      mounted = false
      sub?.subscription?.unsubscribe?.()
    }
  }, [])

  return (
    <Routes>
      <Route path="/" element={session ? <Navigate to="/dashboard" /> : <Navigate to="/signin" />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/confirm" element={<Confirm />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute session={session}>
            <Dashboard session={session} />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

