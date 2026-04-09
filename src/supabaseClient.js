import { createClient } from '@supabase/supabase-js'

// Use "import.meta.env" for Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// This prevents the "Invalid supabaseUrl" crash by providing a dummy string 
// if the real one is missing, allowing the app to at least load.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-fix.supabase.co', 
  supabaseAnonKey || 'placeholder'
)

if (!supabaseUrl) {
  console.error("❌ DEPLOYMENT ERROR: VITE_SUPABASE_URL is missing from environment variables!")
}