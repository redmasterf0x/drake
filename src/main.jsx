import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles.css'

// If Vite env vars for Supabase are missing at runtime, show a helpful error
const missingSupabase = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY

if (missingSupabase) {
  const root = document.getElementById('root')
  root.innerHTML = `
    <div style="font-family:system-ui, sans-serif;padding:24px;">
      <h1>Configuration error</h1>
      <p>The application is missing Supabase configuration. Please ensure the following environment variables are set at build time:</p>
      <ul>
        <li><code>VITE_SUPABASE_URL</code></li>
        <li><code>VITE_SUPABASE_ANON_KEY</code></li>
        <li><code>VITE_SITE_URL</code> (optional for redirects)</li>
      </ul>
      <p>If you're using Netlify, add them under <strong>Site settings → Build & deploy → Environment</strong> and trigger a deploy.</p>
      <p>Current build-time values: <code>VITE_SUPABASE_URL=${import.meta.env.VITE_SUPABASE_URL}</code></p>
    </div>
  `
} else {
  createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  )
}
