import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY

if (!supabaseUrl) throw new Error('NEXT_PUBLIC_SUPABASE_URL ortam değişkeni tanımlanmamış')
if (!supabaseServiceKey) throw new Error('SUPABASE_SERVICE_KEY ortam değişkeni tanımlanmamış')

// Server-side admin client — RLS bypass için service key kullanır
export const supabase = createClient(supabaseUrl, supabaseServiceKey)

export const STORAGE_BUCKET = 'card-images'

export function getPublicUrl(filename: string): string {
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filename)
  return data.publicUrl
}
