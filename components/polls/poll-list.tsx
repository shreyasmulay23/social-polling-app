'use client'

import {useEffect, useState} from 'react'
import {PollCard} from './poll-card'
import {Skeleton} from '@/components/ui/skeleton'
import {supabase} from '@/lib/supabaseClient'
import {PollWithVotes, Vote, Option} from "@/types";
import {Card, CardContent} from "@/components/ui/card";

export function PollList() {
    const [polls, setPolls] = useState<PollWithVotes[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPolls = async () => {
            const {data: {user}} = await supabase.auth.getUser()
            if (!user) return

            // Fetch polls with options and votes
            const {data, error} = await supabase
                .from('polls')
                .select(`
          *,
          options(*),
          votes(*)
        `)
                .order('created_at', {ascending: false})

            if (error) {
                console.error('Error fetching polls:', error)
                return
            }

            // Transform data
            const enrichedPolls = data.map((poll) => {
                const total_votes = poll.votes.length
                const user_has_voted = poll.votes.some((v: Vote) => v.user_id === user.id)

                const options = poll.options.map((option: Option) => {
                    const vote_count = poll.votes.filter((v: Vote) => v.option_id === option.id).length
                    const percentage = total_votes > 0 ? Math.round((vote_count / total_votes) * 100) : 0
                    return {...option, vote_count, percentage}
                })

                return {...poll, options, total_votes, user_has_voted}
            })

            setPolls(enrichedPolls as PollWithVotes[])
            setLoading(false)
        }

        fetchPolls()

        // Set up realtime subscription
        const channel = supabase
            .channel('polls_changes')
            .on(
                'postgres_changes',
                {event: '*', schema: 'public', table: 'polls'},
                fetchPolls
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase])

    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-6 space-y-4">
                            <Skeleton className="h-6 w-3/4"/>
                            <div className="space-y-2">
                                {[...Array(4)].map((_, j) => (
                                    <Skeleton key={j} className="h-4 w-full"/>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {polls.map(poll => (
                <PollCard key={poll.id} poll={poll}/>
            ))}
        </div>
    )
}