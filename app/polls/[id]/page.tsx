import {PollCard} from '@/components/polls/poll-card'
import {notFound} from 'next/navigation'
import {supabase} from '@/lib/supabaseClient'

interface PageProps {
    params: {
        id: string
    }
}
export default async function PollPage({ params }: PageProps) {
    const {data: {user}} = await supabase.auth.getUser()

    const {data: pollData} = await supabase
        .from('polls')
        .select(`
      *,
      options(*),
      votes(*)
    `)
        .eq('id', params.id)
        .single()

    if (!pollData) return notFound()

    const total_votes = pollData.votes.length
    const user_has_voted = user ? pollData.votes.some(v => v.user_id === user.id) : false

    const options = pollData.options.map(option => {
        const vote_count = pollData.votes.filter(v => v.option_id === option.id).length
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