import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Check if real credentials are configured
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// Create client with real or dummy credentials
export const supabase = isSupabaseConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

if (!isSupabaseConfigured) {
    console.info(
        '🔖 La\'verse: Running in demo mode. ' +
        'To enable real authentication, create a .env file with:\n' +
        '  VITE_SUPABASE_URL=your_supabase_url\n' +
        '  VITE_SUPABASE_ANON_KEY=your_supabase_anon_key'
    )
}
