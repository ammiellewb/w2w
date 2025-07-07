import { NextResponse } from "next/server";
import supabase from '@/lib/supabaseClient';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const programId = searchParams.get('programId')!

    const { data } = await supabase
    .from('comments')
    .select(`
      id, parent_id, author_name, content, created_at, is_verified, rating,
      reactions ( id )
    `)
    .eq('program_id', programId)
    // .eq('is_verified', true)
    .order('created_at', { ascending: false })

    const comments = data?.map(c => ({
        ...c,
        reactionCount: c.reactions.length
      })) ?? []

    return NextResponse.json(comments)
}

export async function POST(request: Request) {
    const { programId, parentId, authorName, content, rating } = await request.json()

    // server-side validation: if rating is set, comment must be non-empty
    if (rating != null && (!content || content.trim().length === 0)) {
        return NextResponse.json(
          { error: 'You must leave a comment when providing a rating.' },
          { status: 400 }
        )
    }

    const { data, error } = await supabase
        .from('comments')
        .insert({
            program_id: programId,
            parent_id: parentId || null,
            author_name: authorName || 'Anonymous',
            content,
            rating,
            is_verified: false // default
        })
        .select()
        .single()

    if (error) throw error
    if (!data || !data[0]) {
        return NextResponse.json({ error: "Failed to insert comment." }, { status: 500 });
    }
    return NextResponse.json(data[0])
}
