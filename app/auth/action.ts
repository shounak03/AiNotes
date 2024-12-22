'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  console.log(data);
  

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { errorMessage: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/notebook')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()


  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  console.log(data);

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    console.log(error);
    
    return { errorMessage: error.message }
  }


  revalidatePath('/', 'layout')
  redirect('/notebook')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/auth/login')
}