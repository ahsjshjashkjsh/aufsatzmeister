'use server'
import { createClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== process.env.ADMIN_EMAIL) redirect('/dashboard')
  return user
}

export async function setPremium(userId: string, isPremium: boolean) {
  await assertAdmin()
  await supabaseAdmin
    .from('profiles')
    .update({ is_premium: isPremium })
    .eq('id', userId)
  revalidatePath('/admin')
}
