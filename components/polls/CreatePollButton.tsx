'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { CreatePollForm } from './CreatePollForm'
import {useState} from "react";

export function CreatePollButton() {
    const router = useRouter()
    const [open, setOpen] = useState(false)

    const handleSuccess = (pollId: string) => {
        setOpen(false)
        router.refresh()
        router.push(`/polls/${pollId}`)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Poll
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Poll</DialogTitle>
                </DialogHeader>
                <CreatePollForm onSuccess={handleSuccess} />
            </DialogContent>
        </Dialog>
    )
}