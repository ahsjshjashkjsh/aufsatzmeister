import { createClient } from '@/lib/supabase-server'
import { analyzeEssay } from '@/lib/claude'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('is_premium').eq('id', user.id).single()
  const isPremium = profile?.is_premium ?? false

  if (!isPremium) {
    const currentMonth = new Date().toISOString().slice(0, 7)
    const { data: monthlyCount } = await supabase
      .from('monthly_analysis_count')
      .select('count')
      .eq('user_id', user.id)
      .eq('month', currentMonth)
      .single()

    if (monthlyCount && monthlyCount.count >= 1) {
      return NextResponse.json({ error: 'LIMIT_REACHED' }, { status: 403 })
    }
  }

  const { text } = await request.json()
  if (!text || text.length < 50) {
    return NextResponse.json({ error: 'Text zu kurz (min. 50 Zeichen)' }, { status: 400 })
  }

  try {
    const feedback = await analyzeEssay(text)

    await supabase.from('essay_analyses').insert({
      user_id: user.id,
      original_text: text,
      feedback,
    })

    if (!isPremium) {
      const currentMonth = new Date().toISOString().slice(0, 7)
      await supabase.from('monthly_analysis_count').upsert({
        user_id: user.id,
        month: currentMonth,
        count: 1,
      }, { onConflict: 'user_id,month' })
    }

    return NextResponse.json({ feedback })
  } catch {
    return NextResponse.json({ error: 'Analyse fehlgeschlagen' }, { status: 500 })
  }
}
