'use client'

import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {toast} from '@/hooks/use-toast'
import {Plus, Trash} from 'lucide-react'
import {useState} from 'react'

export function CreatePollForm({onSuccess}: { onSuccess: () => void }) {
    const [question, setQuestion] = useState('')
    const [options, setOptions] = useState(['', ''])
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Add an option (limit to 4)
    const addOption = () => {
        if (options.length < 4) {
            setOptions([...options, ''])
        }
    }

    // Remove an option (limit to minimum of 2)
    const removeOption = (index: number) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index))
        }
    }

    // Update the option text
    const updateOption = (index: number, value: string) => {
        const newOptions = [...options]
        newOptions[index] = value
        setOptions(newOptions)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // Call the API to create poll and options
            const response = await fetch('/api/poll', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question,
                    options,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error creating poll:', errorData.message);
                alert(`Failed to create poll: ${errorData.message}`);
                setIsSubmitting(false);
                return;
            }

            const data = await response.json();
            const pollId = data.pollId;
            console.log(pollId);
            toast({
                title: 'Poll created successfully',
                description: 'The poll has been created.',
            })
            setTimeout(() => window.location.reload(), 200);
            onSuccess();
        } catch (err) {
            console.error('Unexpected error:', err);
            alert('An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    }

    const isValid = question.trim() !== '' &&
        options.filter(o => o.trim() !== '').length >= 2

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="question">Title</Label>
                <Input
                    id="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    required
                    placeholder="Enter title"
                />
            </div>
            <div className="space-y-4">
                <Label>Options (minimum 2, maximum 4)</Label>
                {options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <Input
                            value={option}
                            onChange={(e) => updateOption(index, e.target.value)}
                            required={index < 2}  // Ensure that the first 2 options are required
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
                    disabled={options.length >= 4}  // Disable "Add Option" when there are 4 options
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
