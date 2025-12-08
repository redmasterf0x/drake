import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function Confirm() {
  const navigate = useNavigate()

  useEffect(() => {
    // Auto-redirect to signin (with prefilled email) once email confirmation is processed
    async function checkSession() {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        // Email was confirmed and session established; redirect to signin
        const pending = localStorage.getItem('pendingSignup')
        const email = pending ? JSON.parse(pending).email : ''
        navigate(`/signin${email ? `?email=${encodeURIComponent(email)}` : ''}`)
      }
    }
    
    checkSession()
  }, [navigate])

  return (
    <div style={{ padding: 20 }}>
      <h2>Email confirmation</h2>
      <p>Confirming your email... Please wait.</p>
    </div>
  )
}
