'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {useAuth} from '@/hooks/use-auth'
import {CreatePollButton} from '@/components/polls/CreatePollButton'
import {Card, CardContent} from '@/components/ui/card'
import {ClipboardList} from 'lucide-react'
import {PollWithVotes} from "@/types";
import PollCard from "@/components/polls/PollCard";
import PollDialog from "@/components/polls/PollDialog";

export default function DashboardPage() {
    const {user, loading} = useAuth()
    const router = useRouter()
    const [polls, setPolls] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false)
    const [selectedPoll, setSelectedPoll] = useState<PollWithVotes | null>(null);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login')
        }
    }, [user, loading, router])

    useEffect(() => {
        if (!user) return
        const fetchAllPolls = async () => {
            const res = await fetch('/api/polls')
            if (!res.ok) return console.error('Failed to fetch dashboard data')
            const data = await res.json()
            setPolls(data)
            setDataLoaded(true)
        }

        fetchAllPolls()
    }, [user])

    /*const transformPolls = (
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
    }*/

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
                    <div className="flex items-center space-x-2 mb-6">
                        <div className="relative flex items-center justify-center w-4 h-4">
                            <span className="absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75 animate-ping"></span>
                            <span className="relative inline-flex h-3 w-3 rounded-full bg-green-600"></span>
                        </div>
                        <h2 className="text-xl font-semibold">Live Polls</h2>
                    </div>
                    {dataLoaded ? (
                        polls.length > 0 ? (
                            <div className={'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'}>{polls.map((poll, index) => (
                                <PollCard key={index} poll={poll} onClickAction={setSelectedPoll}/>
                            ))}
                                {selectedPoll && (
                                    <PollDialog
                                        poll={selectedPoll}
                                        open={!!selectedPoll}
                                        onCloseAction={() => setSelectedPoll(null)}
                                    />
                                )}
                            </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
                <Card key={i} className="shadow-md border border-gray-200 rounded-2xl">
                    <CardContent className="p-6 space-y-4 animate-pulse">
                        <div className="h-6 bg-gray-300 rounded w-2/3 mb-4"></div>
                        <div className="space-y-2">
                            {[...Array(3)].map((_, j) => (
                                <div
                                    key={j}
                                    className="h-4 bg-gray-200 rounded w-full"
                                ></div>
                            ))}
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-1/3 mt-6"></div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
