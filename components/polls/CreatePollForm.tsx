'use client'

import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {toast} from '@/hooks/use-toast'
import {Plus, Trash} from 'lucide-react'
import {useEffect, useState} from 'react'
import {API_ROUTES} from "@/utils/apiRoutes";
import axios from "axios";
import {useAuth} from "@/hooks/use-auth";
import {useRouter} from "next/navigation";

export function CreatePollForm({onSuccess}: { onSuccess: () => void }) {
    const {user, loading} = useAuth()
    const router = useRouter()
    const [question, setQuestion] = useState('')
    const [options, setOptions] = useState(['', ''])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const remainingChars = 150 - question.length;

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login')
        }
    }, [user, loading, router])

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
        if (!user) return
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const {data} = await axios.post(API_ROUTES.POLLS.CREATE_POLL, {
                userId: user.id, question,
                options
            })

            const pollId = data.pollId;
            console.log(pollId);
            toast({
                title: 'Poll created successfully',
                description: 'The poll has been created.',
            })
            setTimeout(() => window.location.reload(), 200);
            onSuccess();
        } catch (err) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'An unexpected error occurred.',
            })
            console.error('Unexpected error:', err);
        } finally {
            setIsSubmitting(false);
        }
    }

    const isValid = question.trim() !== '' &&
        options.filter(o => o.trim() !== '').length >= 2

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="question">Title <p className={'font-light text-muted-foreground'}>(Max 150
                    characters)</p></Label>
                <div className="relative">
                    <Input
                        id="question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        required
                        maxLength={150}
                        className="pr-16"
                    />
                    <span className={`absolute right-3 top-2 text-xs ${
                        (150 - question.length) < 20 ? 'text-destructive' : 'text-muted-foreground'
                    }`}>
                {150 - question.length}
            </span>
                </div>
            </div>
            <div className="space-y-4">
                <Label>Options <p className={'font-light text-muted-foreground'}>(minimum 2, maximum 4)</p></Label>
                {options.map((option, index) => {
                    const remainingChars = 10 - option.length;
                    return (
                        <div key={index} className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <Input
                                    value={option}
                                    onChange={(e) => updateOption(index, e.target.value)}
                                    required={index < 2}
                                    maxLength={10}
                                    placeholder={`Option ${index + 1}`}
                                    className="pr-16" // Make space for counter
                                />
                                <span className={`absolute right-3 top-2 text-xs ${
                                    remainingChars < 5 ? 'text-destructive' : 'text-muted-foreground'
                                }`}>
                    {remainingChars}
                </span>
                            </div>
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
                    );
                })}

                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={addOption}
                    disabled={options.length >= 4}  // Disable "Add Option" when there are 4 options
                >
                    <Plus className="mr-2 h-4 w-4"/>
                    Add Option {options.length >= 4 ? '(Maximum reached)' : ''}
                </Button>
            </div>

            <Button type="submit" className="w-full" disabled={!isValid || isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Poll'}
            </Button>
        </form>
    )
}
