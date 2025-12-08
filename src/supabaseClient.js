import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase = null

if (supabaseUrl && supabaseAnonKey) {
	supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
	// Provide a minimal stub so importing modules don't crash during runtime
	// This makes the missing-env situation visible and recoverable.
	console.error('Missing Supabase env vars: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
	supabase = {
		auth: {
			getSession: async () => ({ data: { session: null } }),
			onAuthStateChange: () => ({ subscription: { unsubscribe: () => {} } }),
			signUp: async () => ({ data: null, error: new Error('Missing Supabase environment variables') }),
			signInWithPassword: async () => ({ data: null, error: new Error('Missing Supabase environment variables') }),
			signOut: async () => ({ error: new Error('Missing Supabase environment variables') }),
		},
	}
}

export { supabase }
