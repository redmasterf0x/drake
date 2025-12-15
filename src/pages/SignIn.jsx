import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState(null)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const pre = searchParams.get('email')
    if (pre) setEmail(pre)
  }, [searchParams])

  async function handleSubmit(e) {
    e.preventDefault()
    setErrorMsg(null)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setErrorMsg(error.message)
      return
    }
    // If we have pending signup info (from initial signup), create/update profile in profiles table
    try {
      const pending = localStorage.getItem('pendingSignup')
      if (pending && data.user) {
        const p = JSON.parse(pending)
        await supabase.from('profiles').upsert({
          id: data.user.id,
          first_name: p.firstName || null,
          last_name: p.lastName || null,
          display_name: p.displayName || null,
        })
        localStorage.removeItem('pendingSignup')
      }
    } catch (err) {
      console.error('Failed to create/update profile', err)
    }

    navigate('/dashboard')
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Sign in</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Sign in</button>
      </form>
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      <p>
        Need an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  )
}
