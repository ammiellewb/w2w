import { NextResponse } from "next/server";
import supabase from '@/lib/supabaseClient';

export async function POST(request: Request) {
  const { commentId } = await request.json()
  const { data, error } = await supabase
    .from('reactions')
    .insert({ comment_id: commentId })
  if (error) throw error
  return NextResponse.json({ success: true })
}