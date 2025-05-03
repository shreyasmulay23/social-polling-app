'use client'

import { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'

interface Option {
    id: string
    text: string
    vote_count: number
}

export function VoteForm({
                             pollId,
                             options,
                             selectedOptionId,
                         }: {
    pollId: string
    options: Option[]
    selectedOptionId?: string | null
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
            const { data: { user }, error: authError } = await supabase.auth.getUser()
            if (authError || !user) throw new Error('You must be logged in to vote')

            const { count } = await supabase
                .from('votes')
                .select('*', { count: 'exact' })
                .eq('poll_id', pollId)
                .eq('user_id', user.id)

            if (count && count > 0) {
                throw new Error('You have already voted on this poll')
            }

            const { error } = await supabase
                .from('votes')
                .insert({
                    poll_id: pollId,
                    option_id: selectedOption,
                    user_id: user.id,
                })

            if (error) throw new Error(error.message)

            toast({
                title: 'Vote submitted!',
                description: 'Your vote has been recorded.',
            })

            window.location.reload() // Refresh to reflect new vote count
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
                {option.vote_count} votes <br />
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
