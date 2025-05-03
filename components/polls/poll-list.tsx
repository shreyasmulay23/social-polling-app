'use client'

import { PollCard } from './poll-card'
import { Skeleton } from '@/components/ui/skeleton'
import { PollWithVotes } from "@/types"
import { Card, CardContent } from "@/components/ui/card"

type PollListProps = {
    polls?: PollWithVotes[]
    loading?: boolean
}

export function PollList({ polls = [], loading = false }: PollListProps) {
    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-6 space-y-4">
                            <Skeleton className="h-6 w-3/4" />
                            <div className="space-y-2">
                                {[...Array(4)].map((_, j) => (
                                    <Skeleton key={j} className="h-4 w-full" />
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
                <PollCard key={poll.id} poll={poll} />
            ))}
        </div>
    )
}
