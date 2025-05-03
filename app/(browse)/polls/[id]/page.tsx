import {PollCard} from '@/components/polls/poll-card'
import {notFound} from 'next/navigation'
import {Option, Vote} from "@/types";
import {supabase} from "@/lib/supabase/client";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function PollPage({params}: PageProps) {
    const {id} = await params;
    const {data: {user}} = await supabase.auth.getUser()

    const {data: pollData} = await supabase
        .from('polls')
        .select(`
      *,
      options(*),
      votes(*)
    `)
        .eq('id', id)
        .single()

    if (!pollData) return notFound()

    const total_votes = pollData.votes.length
    const user_has_voted = user ? pollData.votes.some((v: Vote) => v.user_id === user.id) : false

    const options = pollData.options.map((option: Option) => {
        const vote_count = pollData.votes.filter((v: Vote) => v.option_id === option.id).length
        const percentage = total_votes > 0 ? Math.round((vote_count / total_votes) * 100) : 0
        return {...option, vote_count, percentage}
    })

    const poll = {
        ...pollData,
        options,
        total_votes,
        user_has_voted
    }

    return (
        <div className="container py-8">
            <PollCard poll={poll}/>
        </div>
    )
}