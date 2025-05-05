'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {useAuth} from '@/hooks/use-auth'
import {CreatePollButton} from '@/components/polls/CreatePollButton'
import {Card, CardContent} from '@/components/ui/card'
import {ClipboardList} from 'lucide-react'
import {PollWithVotes, Vote} from "@/types";
import PollCard from "@/components/polls/PollCard";
import PollDialog from "@/components/polls/PollDialog";
import {supabase} from "@/lib/supabase/client";
import {RealtimeChannel} from '@supabase/supabase-js'
import axios from 'axios'
import {API_ROUTES} from "@/utils/apiRoutes";


export default function DashboardPage() {
    const {user, loading} = useAuth()
    const router = useRouter()
    const [polls, setPolls] = useState<PollWithVotes[]>([]);
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
            const {data} = await axios.get(API_ROUTES.POLLS.GET_ALL_BY_USER_ID(user.id))
            setPolls(data)
            setDataLoaded(true)
        }

        fetchAllPolls()
    }, [user])

    useEffect(() => {
        if (!user) return;

        let votesChannel: RealtimeChannel;
        let pollsChannel: RealtimeChannel;

        const setupSubscription = async () => {
            votesChannel = supabase
                .channel('poll_votes')
                .on(
                    'postgres_changes',
                    {event: 'INSERT', schema: 'public', table: 'votes'},
                    (payload) => {
                        mergeUpdatedPoll({newVote: payload.new as Vote});
                    }
                )
                .subscribe()

            // Subscribe to polls
            pollsChannel = supabase
                .channel('poll_events')
                .on(
                    'postgres_changes',
                    {event: 'INSERT', schema: 'public', table: 'polls'},
                    payload => {
                        mergeUpdatedPoll({updatedPoll: payload.new as PollWithVotes});
                    }
                )
                .on(
                    'postgres_changes',
                    {event: 'UPDATE', schema: 'public', table: 'polls'},
                    payload => {
                        mergeUpdatedPoll({updatedPoll: payload.new as PollWithVotes});
                    }
                )
                .on(
                    'postgres_changes',
                    {event: 'DELETE', schema: 'public', table: 'polls'},
                    payload => {
                        removeDeletedPoll(payload.old.id);
                    }
                )
                .subscribe();
        };

        setupSubscription();

        return () => {
            if (votesChannel) supabase.removeChannel(votesChannel);
            if (pollsChannel) supabase.removeChannel(pollsChannel);
        };
    }, [user]);

    type MergeUpdatedPollArgs = {
        updatedPoll?: PollWithVotes;
        newVote?: Vote;
    };


    const mergeUpdatedPoll = ({updatedPoll, newVote}: MergeUpdatedPollArgs) => {
        setPolls(prevPolls =>
            prevPolls.map(poll => {
                if (updatedPoll && poll.id === updatedPoll.id) {
                    return {
                        ...poll,
                        ...updatedPoll,
                        options: updatedPoll.options ?? poll.options,
                        votes: updatedPoll.votes ?? poll.votes,
                        total_votes: updatedPoll.total_votes ?? poll.total_votes,
                    };
                }

                if (newVote && poll.id === newVote.poll_id) {
                    return {
                        ...poll,
                        votes: [...poll.votes, newVote],
                        total_votes: poll.total_votes + 1,
                        options: poll.options.map(option => {
                            if (option.id !== newVote.option_id) return option;
                            return {
                                ...option,
                                vote_count: option.vote_count + 1,
                                percentage: Math.round(
                                    ((option.vote_count + 1) / (poll.total_votes + 1)) * 100
                                )
                            };
                        })
                    };
                }

                return poll;
            })
        );
    };

    const removeDeletedPoll = (deletedPollId: string) => {
        setPolls(prevPolls => prevPolls.filter(p => p.id !== deletedPollId));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!user) return null

    return (
        <div className="container mx-auto py-8 mt-[100px]">
            <div
                className="flex justify-center sm:justify-between items-center mb-8 flex-wrap gap-5 text-center sm:text-left">
                <h1 className="text-xl sm:text-3xl font-bold truncate max-w-[320px] sm:max-w-full sm:whitespace-normal"
                    title={`Welcome, ${user.email}`}>Welcome, {user.email}</h1>
                <CreatePollButton/>
            </div>

            <div className="grid gap-8">
                <section>
                    {polls.length > 0 && <div className="flex items-center space-x-2 mb-6">
                        <div className="relative flex items-center justify-center w-4 h-4">
                            <span
                                className="absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75 animate-ping"></span>
                            <span className="relative inline-flex h-3 w-3 rounded-full bg-green-600"></span>
                        </div>
                        <h2 className="text-xl font-semibold">Live Polls</h2>
                    </div>
                    }

                    {dataLoaded ? (
                        polls.length > 0 ? (
                            <div
                                className={'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'}>{polls.map((poll, index) => (
                                <PollCard key={index} poll={poll} onClickAction={(arg: PollWithVotes | string) => {
                                    if (typeof arg === 'string' && arg === 'CLOSE_DIALOG') {
                                        setSelectedPoll(null);
                                    } else if (typeof arg !== 'string') {
                                        setSelectedPoll(arg);
                                    }
                                }}/>
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
