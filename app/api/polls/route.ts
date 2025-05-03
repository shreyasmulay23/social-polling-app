// app/api/polls/route.ts
import {NextResponse} from 'next/server'
import {Option, PollWithVotes, Vote} from '@/types'
import {createServerSupabaseClient} from "@/lib/supabase/server";

export async function GET() {
    const supabase = createServerSupabaseClient()
    const {
        data: {user},
        error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
        console.error('User fetch error:', userError)
        return NextResponse.json([], {status: 401})
    }

    const {data, error} = await supabase
        .from('polls')
        .select(`
      *,
      options(*),
      votes(*)
    `)
        .order('created_at', {ascending: false})

    if (error) {
        console.error('Poll fetch error:', error)
        return NextResponse.json([], {status: 500})
    }

    // Enrich poll data with vote counts and percentage
    const enrichedPolls: PollWithVotes[] = data.map((poll) => {
        const total_votes = poll.votes.length
        const user_has_voted = poll.votes.some(
            (v: Vote) => v.user_id === user?.id
        )

        const options = poll.options.map((option: Option) => {
            const vote_count = poll.votes.filter((v: Vote) => v.option_id === option.id).length
            const percentage = total_votes > 0
                ? Math.round((vote_count / total_votes) * 100)
                : 0
            return {
                ...option,
                vote_count,
                percentage,
            }
        })

        return {
            ...poll,
            options,
            total_votes,
            user_has_voted,
        }
    })

    return NextResponse.json(enrichedPolls)
}
