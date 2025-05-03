'use client'

import {useAuth} from '@/hooks/use-auth'
import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'
import {PollList} from '@/components/polls/poll-list'
import {Card, CardContent} from '@/components/ui/card'
import {ClipboardList, MessageSquareWarning} from 'lucide-react'
import {PollWithVotes} from "@/types";
import {supabase} from "@/lib/supabaseClient";
import {CreatePollButton} from "@/components/polls/create-poll-button";

export default function DashboardPage() {
    const {user, loading} = useAuth()
    const router = useRouter()
    const [userPolls, setUserPolls] = useState<PollWithVotes[]>([])
    const [votedPolls, setVotedPolls] = useState<PollWithVotes[]>([])
    const [dataLoaded, setDataLoaded] = useState(false)

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login')
        }
    }, [user, loading, router])

    const fetchPolls = async () => {
        if (!user) return


        // Fetch polls created by user
        const {data: userPollsData} = await supabase
            .from('polls')
            .select(`*, options(*), votes(*)`)
            .eq('user_id', user.id)
            .order('created_at', {ascending: false})

        // Fetch polls voted by user
        const {data: votedPollsData} = await supabase
            .from('votes')
            .select(`poll_id`)
            .eq('user_id', user.id)
            .then(async ({data: votes}) => {
                if (!votes || votes.length === 0) return []
                const pollIds = votes.map(v => v.poll_id)
                const {data} = await supabase
                    .from('polls')
                    .select(`*, options(*), votes(*)`)
                    .in('id', pollIds)
                return data || []
            })

        setUserPolls(transformPolls(userPollsData || [], user.id))
        setVotedPolls(transformPolls(votedPollsData || [], user.id))
        setDataLoaded(true)
    }

    const transformPolls = (polls: any[], userId: string) => {
        return polls.map(poll => {
            const total_votes = poll.votes.length
            const user_has_voted = poll.votes.some((v: any) => v.user_id === userId)

            const options = poll.options.map((option: any) => {
                const vote_count = poll.votes.filter((v: any) => v.option_id === option.id).length
                const percentage = total_votes > 0 ? Math.round((vote_count / total_votes) * 100) : 0
                return {...option, vote_count, percentage}
            })

            return {...poll, options, total_votes, user_has_voted}
        })
    }

    useEffect(() => {
        fetchPolls()
        const channel = supabase
            .channel('dashboard_changes')
            .on('postgres_changes', {event: '*', schema: 'public', table: 'polls'}, fetchPolls)
            .on('postgres_changes', {event: '*', schema: 'public', table: 'votes'}, fetchPolls)
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [user])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!user) {
        return null // Will redirect via useEffect
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Welcome, {user.email}</h1>
                <div className="flex gap-4">
                    <CreatePollButton/>
                </div>
            </div>

            <div className="grid gap-8">

                <section>
                    <h2 className="text-2xl font-semibold mb-4">Your Recent Polls</h2>
                    {dataLoaded ? (
                        userPolls.length > 0 ? (
                            <PollList polls={userPolls}/>
                        ) : (
                            <EmptyState
                                icon={<ClipboardList className="h-12 w-12"/>}
                                title="No polls created yet"
                                description="Get started by creating your first poll"
                                action={null}
                            />
                        )
                    ) : (
                        <PollListSkeleton/>
                    )}
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">Polls You've Voted On</h2>
                    {dataLoaded ? (
                        votedPolls.length > 0 ? (
                            <PollList polls={votedPolls}/>
                        ) : (
                            <EmptyState
                                icon={<MessageSquareWarning className="h-12 w-12"/>}
                                title="No votes yet"
                                description="Vote on polls to see them appear here"
                            />
                        )
                    ) : (
                        <PollListSkeleton/>
                    )}
                </section>
            </div>
        </div>
    )
}

// Empty State Component
function EmptyState({icon, title, description, action}: {
    icon: React.ReactNode,
    title: string,
    description: string,
    action?: React.ReactNode
}) {
    return (
        <Card>
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <div className="mb-4 text-muted-foreground">{icon}</div>
                <h3 className="text-lg font-medium mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{description}</p>
                {action}
            </CardContent>
        </Card>
    )
}

// Skeleton Loader
function PollListSkeleton() {
    return (
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                <Card key={i}>
                    <CardContent className="p-6 space-y-4">
                        <div className="animate-pulse">
                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                            <div className="space-y-2">
                                {[...Array(4)].map((_, j) => (
                                    <div key={j} className="h-4 bg-gray-200 rounded w-full"></div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}