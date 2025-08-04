// app/page.tsx
// import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/dashboard') 
}