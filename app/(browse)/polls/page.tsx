// app/(browse)/polls/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { PollWithVotes } from '@/types'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {PollList} from "@/components/polls/poll-list";

export default function PollsPage() {
    const [allPolls, setAllPolls] = useState<PollWithVotes[]>([])
    const [filteredPolls, setFilteredPolls] = useState<PollWithVotes[]>([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPolls = async () => {
            try {
                const res = await fetch('/api/polls')
                const data = await res.json()
                setAllPolls(data)
                setFilteredPolls(data)
            } catch (err) {
                console.error('Failed to fetch polls:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchPolls()
    }, [])

    useEffect(() => {
        const lowerSearch = search.toLowerCase()
        const filtered = allPolls.filter(poll =>
            poll.question.toLowerCase().includes(lowerSearch)
        )
        setFilteredPolls(filtered)
    }, [search, allPolls])

    if (loading) {
        return (
            <div className="space-y-4">
                <Input disabled placeholder="Search polls..." />
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
            <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search polls by title..."
                className="w-full max-w-md"
            />
            <PollList polls={filteredPolls} />
        </div>
    )
}
