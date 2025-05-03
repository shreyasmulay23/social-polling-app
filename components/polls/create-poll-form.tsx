'use client'

import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Plus, Trash} from 'lucide-react'
import {useState} from 'react'
import {supabase} from "@/lib/supabaseClient";
import {Select, SelectContent, SelectTrigger} from "@radix-ui/react-select";
import {SelectItem, SelectValue} from "@/components/ui/select";
import {pollConstants} from "@/components/polls/consants";

export function CreatePollForm({onSuccess}: { onSuccess: (pollId: string) => void }) {
    const [question, setQuestion] = useState('')
    const [options, setOptions] = useState(['', ''])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [category, setCategory] = useState('');

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

        const {data: {user}, error: authError} = await supabase.auth.getUser()

        if (authError || !user) {
            console.error('Authentication error:', authError)
            setIsSubmitting(false)
            return
        }

        try {
            // Create poll
            const {data: poll, error: pollError} = await supabase
                .from('polls')
                .insert({question, user_id: user.id})
                .select()
                .single()

            if (pollError) {
                console.error('Error creating poll:', pollError)
                alert(`Failed to create poll: ${pollError.message}`)
                setIsSubmitting(false)
                return
            }

            // Create options (filter out empty options)
            const optionsData = options
                .filter(text => text.trim() !== '')
                .map(text => ({
                    text,
                    poll_id: poll.id,
                }))

            const {error: optionsError} = await supabase
                .from('options')
                .insert(optionsData)

            if (optionsError) {
                // Attempt to delete the poll if options creation fails
                await supabase.from('polls').delete().eq('id', poll.id)
                console.error('Error creating options:', optionsError)
                alert(`Failed to create poll options: ${optionsError.message}`)
            } else {
                onSuccess(poll.id)
            }
        } catch (err) {
            console.error('Unexpected error:', err)
            alert('An unexpected error occurred')
        } finally {
            setIsSubmitting(false)
        }
    }

    const isValid = question.trim() !== '' &&
        options.filter(o => o.trim() !== '').length >= 2

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
            // Add to your create poll form
            <div className="space-y-2">
                <Label>Category</Label>
                <Select
                    value={category}
                    onValueChange={setCategory}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select a category"/>
                    </SelectTrigger>
                    <SelectContent>
                        {pollConstants.categories.filter(c => c.value).map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-4">
                <Label>Options (minimum 2)</Label>
                {options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <Input
                            value={option}
                            onChange={(e) => updateOption(index, e.target.value)}
                            required={index < 2}
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

            <Button type="submit" className="w-full" disabled={!isValid || isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Poll'}
            </Button>
        </form>
    )
}