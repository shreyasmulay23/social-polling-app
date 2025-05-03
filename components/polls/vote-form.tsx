'use client'

import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {toast} from "@/hooks/use-toast";
import {supabase} from "@/lib/supabase/client";

export function VoteForm({ pollId, options }: { pollId: string, options: Array<{ id: string, text: string }> }) {
    const [selectedOption, setSelectedOption] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedOption) return

        setIsSubmitting(true)

        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser()

            if (authError || !user) {
                throw new Error('You must be logged in to vote')
            }

            // Check if user already voted
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
                    user_id: user.id
                })

            if (error) {
                throw new Error(error.message)
            }

            toast({
                title: 'Vote submitted!',
                description: 'Your vote has been recorded',
            })

            router.refresh()
        } catch (error) {
            if (error instanceof Error) {
                toast({
                    title: 'Vote failed',
                    description: error.message,
                    variant: 'destructive'
                })
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                {options.map(option => (
                    <div key={option.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                        <Label htmlFor={`option-${option.id}`}>{option.text}</Label>
                    </div>
                ))}
            </RadioGroup>
            <Button type="submit" disabled={!selectedOption || isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Vote'}
            </Button>
        </form>
    )
}