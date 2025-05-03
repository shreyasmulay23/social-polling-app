'use client'

import {useEffect, useState} from 'react'
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Button} from '@/components/ui/button'
import {Pencil, Plus, Trash} from 'lucide-react'
import {supabase} from '@/lib/supabase/client'

export function EditPollForm({pollId, onSuccess}: { pollId: string, onSuccess?: () => void }) {
    const [open, setOpen] = useState(false)
    const [question, setQuestion] = useState('')
    const [options, setOptions] = useState<string[]>([])
    const [hasVotes, setHasVotes] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (!open) return

        const fetchPollData = async () => {
            const {data: poll} = await supabase.from('polls').select('question').eq('id', pollId).single()
            const {data: opts} = await supabase.from('options').select('id,text,votes').eq('poll_id', pollId)

            if (poll && opts) {
                setQuestion(poll.question)
                setOptions(opts.map(o => o.text))
                setHasVotes(opts.some(o => o.votes > 0))
            }
        }

        fetchPollData()
    }, [open, pollId])

    const handleUpdate = async () => {
        setIsSubmitting(true)

        try {
            // Update poll title
            const {error: pollError} = await supabase
                .from('polls')
                .update({question})
                .eq('id', pollId)

            if (pollError) throw pollError

            // Update options
            const {data: currentOptions, error: fetchError} = await supabase
                .from('options')
                .select('id')
                .eq('poll_id', pollId)

            if (fetchError) throw fetchError

            // Update each option
            for (let i = 0; i < options.length; i++) {
                if (currentOptions[i]) {
                    await supabase
                        .from('options')
                        .update({text: options[i]})
                        .eq('id', currentOptions[i].id)
                }
            }

            setOpen(false)
        } catch (err) {
            console.error(err)
            alert("Failed to update poll")
        } finally {
            setIsSubmitting(false)
        }
    }

    const updateOption = (index: number, value: string) => {
        const newOpts = [...options]
        newOpts[index] = value
        setOptions(newOpts)
    }

    const addOption = () => {
        if (hasVotes) return
        setOptions([...options, ''])
    }

    const removeOption = (index: number) => {
        if (hasVotes || options.length <= 2) return
        setOptions(options.filter((_, i) => i !== index))
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    <Pencil className="w-4 h-4 mr-2"/> Edit
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Poll</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="question">Title</Label>
                        <Input
                            id="question"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Options {hasVotes && <span className="text-xs text-muted-foreground">(modification limited due to votes)</span>}</Label>
                        {options.map((opt, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                                <Input
                                    value={opt}
                                    onChange={(e) => updateOption(idx, e.target.value)}
                                    required
                                />
                                {!hasVotes && options.length > 2 && (
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => removeOption(idx)}
                                    >
                                        <Trash className="w-4 h-4"/>
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

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

                    <Button
                        className="w-full"
                        disabled={question.trim() === '' || options.filter(o => o.trim() !== '').length < 2 || isSubmitting}
                        onClick={handleUpdate}
                    >
                        {isSubmitting ? 'Updating...' : 'Update Poll'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
