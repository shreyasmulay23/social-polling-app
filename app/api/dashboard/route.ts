import {NextResponse} from 'next/server'
import {createServerSupabaseClient} from '@/lib/supabase/server';

export async function GET() {
    const supabase = createServerSupabaseClient()
    if (!supabase) {
        return;
    }
    const {data: {user}, error} = await supabase.auth.getUser();

    if (error || !user) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }

    const {data: allPollsData, error: allPollsError} = await supabase
        .from('polls')
        .select(`
      *,
      options(*),
      votes(*)
    `)
        .order('created_at', {ascending: false})

    if (allPollsError) {
        console.error('Poll fetch error:', error)
        return NextResponse.json([], {status: 500})
    }

    // Fetch user-created polls
    const {data: userPollsData} = await supabase
        .from('polls')
        .select(`*, options(*), votes(*)`)
        .eq('user_id', user.id)
        .order('created_at', {ascending: false})

    // Fetch voted polls
    const {data: votes} = await supabase
        .from('votes')
        .select('poll_id')
        .eq('user_id', user.id)

    let votedPollsData = []
    if (votes && votes.length > 0) {
        const pollIds = votes.map((v) => v.poll_id)
        const {data: pollsData} = await supabase
            .from('polls')
            .select('*, options(*), votes(*)')
            .in('id', pollIds)

        votedPollsData = pollsData || []
    }

    return NextResponse.json({
        allPolls: allPollsData || [],
        userPolls: userPollsData || [],
        votedPolls: votedPollsData || [],
        userId: user.id,
    })
}
