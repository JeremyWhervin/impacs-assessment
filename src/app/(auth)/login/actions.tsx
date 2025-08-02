'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,

  }

  console.log('[LOGIN ATTEMPT]', data)

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error('[LOGIN ERROR]', error)
    redirect('/error')
  }

  console.log('[LOGIN SUCCESSFUL]')
  revalidatePath('/dashboard', 'layout')
  redirect('/dashboard')
}


export async function logout() {
 const supabase = await createClient()

  await supabase.auth.signOut()

  redirect('/login')
}