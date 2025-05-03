'use client'

import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {useRouter} from 'next/navigation'
import {useState} from 'react'
import {Plus, Trash} from 'lucide-react'
import {supabase} from "@/lib/supabaseClient";

export function CreatePoll() {
    const [question, setQuestion] = useState('')
    const [options, setOptions] = useState(['', ''])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const addOption = () => setOptions([...options, ''])
    const removeOption = (index: number) => {
        if (options.length <= 2) return
        setOptions(options.filter((_, i) => i !== index))
    }
    const updateOption = (index: number, value: string) => {
        const newOptions = [...options]
        newOptions[index] = value
        setOptions(newOptions)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        const {data: {user}} = await supabase.auth.getUser()
        if (!user) return

        // Create poll
        const {data: poll, error: pollError} = await supabase
            .from('polls')
            .insert({question, user_id: user.id})
            .select()
            .single()

        if (pollError) {
            console.error('Error creating poll:', pollError)
            setIsSubmitting(false)
            return
        }

        // Create options
        const optionsData = options.map(text => ({
            text,
            poll_id: poll.id,
        }))

        const {error: optionsError} = await supabase
            .from('options')
            .insert(optionsData)

        if (optionsError) {
            console.error('Error creating options:', optionsError)
        } else {
            router.push(`/polls/${poll.id}`)
        }

        setIsSubmitting(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <Input
                    id="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    required
                    placeholder="What's your favorite..."
                />
            </div>

            <div className="space-y-4">
                <Label>Options</Label>
                {options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <Input
                            value={option}
                            onChange={(e) => updateOption(index, e.target.value)}
                            required
                            placeholder={`Option ${index + 1}`}
                        />
                        {options.length > 2 && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeOption(index)}
                            >
                                <Trash className="h-4 w-4"/>
                            </Button>
                        )}
                    </div>
                ))}

                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={addOption}
                >
                    <Plus className="mr-2 h-4 w-4"/>
                    Add Option
                </Button>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Poll'}
            </Button>
        </form>
    )
}