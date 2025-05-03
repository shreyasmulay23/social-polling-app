'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {useAuth} from '@/hooks/use-auth'

import {PollList} from '@/components/polls/poll-list'
import {CreatePollButton} from '@/components/polls/create-poll-button'
import {Card, CardContent} from '@/components/ui/card'
import {ClipboardList, MessageSquareWarning} from 'lucide-react'

import {OptionWithStats, Poll, PollWithVotes, Vote} from '@/types'

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

    useEffect(() => {
        if (!user) return

        const fetchDashboardData = async () => {
            const res = await fetch('/api/dashboard')
            if (!res.ok) return console.error('Failed to fetch dashboard data')

            const {userPolls, votedPolls, userId} = await res.json()

            setUserPolls(transformPolls(userPolls, userId))
            setVotedPolls(transformPolls(votedPolls, userId))
            setDataLoaded(true)
        }

        fetchDashboardData()
    }, [user])

    const transformPolls = (
        polls: (Poll & { votes: Vote[]; options: OptionWithStats[] })[],
        userId: string
    ): PollWithVotes[] => {
        return polls.map((poll) => {
            const total_votes = poll.votes.length
            const user_has_voted = poll.votes.some((v) => v.user_id === userId)

            const options = poll.options.map((option) => {
                const vote_count = poll.votes.filter((v) => v.option_id === option.id).length
                const percentage = total_votes > 0 ? Math.round((vote_count / total_votes) * 100) : 0
                return {...option, vote_count, percentage}
            })

            return {
                ...poll,
                total_votes,
                user_has_voted,
                options,
            }
        })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!user) return null

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Welcome, {user.email}</h1>
                <CreatePollButton/>
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
                            />
                        )
                    ) : (
                        <PollListSkeleton/>
                    )}
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">Polls You&apos;ve Voted On</h2>
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

function EmptyState({
                        icon,
                        title,
                        description,
                        action,
                    }: {
    icon: React.ReactNode
    title: string
    description: string
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
