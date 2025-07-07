import { NextResponse } from 'next/server'
import supabase from '@/lib/supabaseClient';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const programId = searchParams.get('programId')

  // join the view on your select:
  const { data, error } = await supabase
    .from('program_ratings')
    .select('avg_rating, rating_count')
    .eq('program_id', programId)
    .single()

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}