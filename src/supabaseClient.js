import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://your-project-id.supabase.co'
const supabaseAnonKey = 'sb_publishable_sQsW5XOhoceWkAQMjuaMxA_2otrokHf'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
