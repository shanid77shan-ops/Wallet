import { createClient } from '@supabase/supabase-js'

// I've plugged in your specific URL here
const supabaseUrl = 'https://meufnjklmkjdmblxpesx.supabase.co'
const supabaseAnonKey = 'sb_publishable_sQsW5XOhoceWkAQMjuaMxA_2otrokHf'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)