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
    // If we have pending signup info (from initial signup), apply it to the user metadata now
    try {
      const pending = localStorage.getItem('pendingSignup')
      if (pending) {
        const p = JSON.parse(pending)
        const meta = {}
        if (p.firstName) meta.first_name = p.firstName
        if (p.lastName) meta.last_name = p.lastName
        if (p.displayName) meta.display_name = p.displayName
        if (Object.keys(meta).length > 0) {
          await supabase.auth.updateUser({ data: meta })
        }
        localStorage.removeItem('pendingSignup')
      }
    } catch (err) {
      console.error('Failed to apply pending signup metadata', err)
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
