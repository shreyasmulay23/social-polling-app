'use client'

import {useEffect, useState} from 'react'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'
import {Label} from '@/components/ui/label'
import {Button} from '@/components/ui/button'
import {toast} from '@/hooks/use-toast'

interface Option {
    id: string
    text: string
    vote_count: number
}

export function VoteForm({
                             pollId,
                             options,
                             selectedOptionId,
                             onSuccessAction
                         }: {
    pollId: string,
    options: Option[],
    selectedOptionId?: string | null,
    onSuccessAction: (arg: string) => void
}) {
    const [selectedOption, setSelectedOption] = useState<string>('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [totalVotes, setTotalVotes] = useState<number>(0)

    const hasVoted = Boolean(selectedOptionId)

    useEffect(() => {
        if (selectedOptionId) setSelectedOption(selectedOptionId)

        const total = options.reduce((acc, option) => acc + (option.vote_count || 0), 0)
        setTotalVotes(total)
    }, [options, selectedOptionId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedOption) return
        setIsSubmitting(true)

        try {
            const response = await fetch('/api/vote', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    pollId,
                    selectedOption,
                }),
            })

            const result = await response.json()

            if (response.status !== 200) {
                throw new Error(result.error || 'Vote submission failed')
            }

            toast({
                title: 'Vote submitted!',
                description: 'Your vote has been recorded.',
            })
            onSuccessAction('CLOSE_DIALOG');
        } catch (error) {
            if (error instanceof Error) {
                toast({
                    title: 'Vote failed',
                    description: error.message,
                    variant: 'destructive',
                })
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const getPercentage = (count: number) => {
        if (totalVotes === 0) return '0%'
        return ((count / totalVotes) * 100).toFixed(1) + '%'
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <RadioGroup
                value={selectedOption}
                onValueChange={setSelectedOption}
                className="space-y-4"
            >
                {options.map((option) => (
                    <div
                        key={option.id}
                        className="flex justify-between items-center p-2 border rounded-md"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem
                                value={option.id}
                                id={`option-${option.id}`}
                                disabled={hasVoted}
                                className="h-5 w-5 border-2 border-gray-300 rounded-full"
                            />
                            <Label htmlFor={`option-${option.id}`} className="text-sm font-medium">
                                {option.text}
                            </Label>
                        </div>
                        {hasVoted && (
                            <span className="text-xs text-muted-foreground text-right w-24">
                                {option.vote_count} votes <br/>
                                ({getPercentage(option.vote_count)})
                            </span>
                        )}
                    </div>
                ))}
            </RadioGroup>

            <Button
                type="submit"
                className="w-full mt-4"
                disabled={!selectedOption || isSubmitting || hasVoted}
            >
                {isSubmitting
                    ? 'Submitting...'
                    : hasVoted
                        ? 'You already voted'
                        : 'Submit Vote'}
            </Button>
        </form>
    )
}
