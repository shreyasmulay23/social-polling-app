'use client'

import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Pencil, Plus, Trash} from 'lucide-react'
import {useState} from 'react'
import type {PollWithVotes} from '@/types'
import {useToast} from "@/hooks/use-toast"
import {API_ROUTES} from "@/utils/apiRoutes";
import axios from "axios";

export function UpdatePollDialog({
                                     poll,
                                     onSuccess,
                                 }: {
    poll: PollWithVotes
    onSuccess: () => void
}) {
    const [question, setQuestion] = useState(poll.question)
    const [options, setOptions] = useState(poll.options.map(o => o.text))
    const hasVotes = poll.total_votes > 0
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)  // State to control dialog visibility
    const {toast} = useToast()

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

        try {
            const {data} = await axios.put(API_ROUTES.POLLS.UPDATE_POLL(poll.id), {
                question,
                options,
                originalOptions: poll.options,
                hasVotes
            })
            if (data.success) {
                toast({
                    title: "Success 🎉",
                    description: "Poll updated successfully.",
                })
                onSuccess()
                // Close the dialog after the update is successful
                setIsDialogOpen(false)
            }
        } catch (err) {
            console.log('Got error', err);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'An unexpected error occurred.',
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button
                    className="w-4 h-4 text-white cursor-pointer"
                    size="icon"
                    onClick={(e) => {
                        e.stopPropagation()
                        setIsDialogOpen(true)  // Open the dialog when the button is clicked
                    }}
                >
                    <Pencil className="h-4 w-4"/>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Modify Poll</DialogTitle>
                </DialogHeader>
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