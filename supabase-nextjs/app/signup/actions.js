'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function signup(formData) {
  const supabase = await createClient()
 
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
    options : {
      data:
      {
        fullname: formData.get('fullname'),
        company: formData.get('company'),
        jobTitle: formData.get('jobTitle')
      }
    }
  }

  const { error } = await supabase.auth.signUp(data)
  
  console.log('\nError:', error)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/home')
}