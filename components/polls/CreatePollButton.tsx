'use client'

import {Button} from '@/components/ui/button'
import {Plus} from 'lucide-react'
import {useRouter} from 'next/navigation'
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,} from '@/components/ui/dialog'
import {CreatePollForm} from './CreatePollForm'
import {useState} from "react";
import {DialogDescription} from "@radix-ui/react-dialog";

export function CreatePollButton() {
    const router = useRouter()
    const [open, setOpen] = useState(false)

    const handleSuccess = () => {
        setOpen(false)
        router.refresh()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4"/>
                    Create Poll
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Poll</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Create a new poll by entering your title and providing multiple options for users to choose from.
                </DialogDescription>
                <CreatePollForm onSuccess={handleSuccess}/>
            </DialogContent>
        </Dialog>
    )
}