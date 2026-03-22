import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export type Dua = {
  id: string
  name: string
  message: string
  created_at: string
}

export type MediaItem = {
  id: string
  url: string
  type: 'image' | 'video' | 'youtube' | 'facebook'
  name: string
  created_at: string
}
