'use client'

import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {PollResults} from './poll-results'
import {VoteForm} from './vote-form'
import {PollWithVotes} from "@/types";

export function PollCard({poll}: { poll: PollWithVotes }) {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{poll.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {poll.user_has_voted ? (
                    <PollResults options={poll.options}/>
                ) : (
                    <VoteForm
                        pollId={poll.id}
                        options={poll.options.map(opt => ({
                            id: opt.id,
                            text: opt.text,
                            poll_id: opt.poll_id
                        }))}
                    />
                )}
            </CardContent>
        </Card>
    )
}