import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vuahcwnmknmxejrpqmte.supabase.co'
const supabaseKey = 'sb_publishable_gHFMP7cexCiQH-JsBaim9g_FFVPgR0J'

export const supabase = createClient(supabaseUrl, supabaseKey)