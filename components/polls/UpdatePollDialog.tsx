'use client'

import {Dialog, DialogContent, DialogTrigger} from '@/components/ui/dialog'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Pencil, Plus, Trash} from 'lucide-react'
import {useState} from 'react'
import {supabase} from '@/lib/supabase/client'
import type {PollWithVotes} from '@/types'

export function UpdatePollDialog({poll, onSuccess}: {
    poll: PollWithVotes
    onSuccess: () => void
}) {
    const [question, setQuestion] = useState(poll.question)
    const [options, setOptions] = useState(poll.options.map(o => o.text))
    const [isSubmitting, setIsSubmitting] = useState(false)
    const hasVotes = poll.total_votes > 0

    const updateOption = (index: number, value: string) => {
        const newOptions = [...options]
        newOptions[index] = value
        setOptions(newOptions)
    }

    const removeOption = (index: number) => {
        if (options.length <= 2) return
        setOptions(options.filter((_, i) => i !== index))
    }

    const addOption = () => {
        setOptions([...options, ''])
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Update the poll question
        const {error: updatePollError} = await supabase
            .from('polls')
            .update({question})
            .eq('id', poll.id)

        if (updatePollError) {
            alert('Failed to update poll title')
            console.error(updatePollError)
            setIsSubmitting(false)
            return
        }

        // Update options text
        const originalOptions = poll.options
        for (let i = 0; i < originalOptions.length; i++) {
            const original = originalOptions[i]
            const updatedText = options[i]

            if (original.text !== updatedText) {
                await supabase
                    .from('options')
                    .update({text: updatedText})
                    .eq('id', original.id)
            }
        }

        // If no votes exist, allow add/delete
        if (!hasVotes) {
            // Delete extra removed options
            const removed = originalOptions.slice(options.length)
            for (const ro of removed) {
                await supabase.from('options').delete().eq('id', ro.id)
            }

            // Add new options
            const newOptions = options.slice(originalOptions.length).filter(o => o.trim() !== '')
            if (newOptions.length > 0) {
                await supabase.from('options').insert(
                    newOptions.map(text => ({text, poll_id: poll.id}))
                )
            }
        }

        onSuccess()
        setIsSubmitting(false)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className={'z-20'} size="icon" onClick={(e) => {
                    e.stopPropagation();
                }}>
                    <Pencil className="h-4 w-4"/>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleUpdate} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="question">Title</Label>
                        <Input
                            id="question"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            required
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
                                />
                                {!hasVotes && options.length > 2 && (
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

                        {!hasVotes && (
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={addOption}
                            >
                                <Plus className="mr-2 h-4 w-4"/>
                                Add Option
                            </Button>
                        )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Updating...' : 'Update Poll'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
