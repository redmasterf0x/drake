import React, { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    localStorage.setItem('pendingSignup', JSON.stringify({ email }))
    // Use configured site URL in production if provided, else fall back to current origin
    const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin
    const redirectTo = `${siteUrl.replace(/\/$/, '')}/confirm`
    const { data, error } = await supabase.auth.signUp(
      { email, password },
      { emailRedirectTo: redirectTo }
    )

    if (error) {
      setMessage({ type: 'error', text: error.message })
      return
    }

    setMessage({ type: 'ok', text: 'Check your email for a confirmation link.' })
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Sign up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Create account</button>
      </form>
      {message && <p>{message.text}</p>}
      <p>
        Already have an account? <a href="/signin">Sign in</a>
      </p>
    </div>
  )
}
