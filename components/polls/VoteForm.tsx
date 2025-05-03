'use client'

import {useEffect, useState} from 'react'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'
import {Label} from '@/components/ui/label'
import {Button} from '@/components/ui/button'
import {toast} from '@/hooks/use-toast'
import {supabase} from '@/lib/supabase/client'

interface Option {
    id: string
    text: string
}

export function VoteForm({
                             pollId,
                             options,
                             selectedOptionId, // 👈 already-voted option passed as prop
                         }: {
    pollId: string
    options: Option[]
    selectedOptionId?: string | null
}) {
    const [selectedOption, setSelectedOption] = useState<string>('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    console.log(selectedOptionId)

    const hasVoted = Boolean(selectedOptionId)

    // ✅ Auto-select the voted option when it is available
    useEffect(() => {
        if (selectedOptionId) {
            setSelectedOption(selectedOptionId)
        }
    }, [selectedOptionId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedOption) return
        setIsSubmitting(true)

        try {
            const {data: {user}, error: authError} = await supabase.auth.getUser()
            if (authError || !user) throw new Error('You must be logged in to vote')

            const {count} = await supabase
                .from('votes')
                .select('*', {count: 'exact'})
                .eq('poll_id', pollId)
                .eq('user_id', user.id)

            if (count && count > 0) {
                throw new Error('You have already voted on this poll')
            }

            const {error} = await supabase
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

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <RadioGroup
                value={selectedOption}
                onValueChange={setSelectedOption}
                className="space-y-4"
            >
                {options.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                        <RadioGroupItem
                            value={option.id}
                            id={`option-${option.id}`}
                            disabled={hasVoted}
                            className={`h-5 w-5 border-2 border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 ${
                                hasVoted && selectedOptionId === option.id
                                    ? 'bg-indigo-500'
                                    : ''
                            }`}
                        />
                        <Label htmlFor={`option-${option.id}`} className="text-sm font-medium">
                            {option.text}
                        </Label>
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
