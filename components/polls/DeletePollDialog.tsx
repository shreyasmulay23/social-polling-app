'use client'

import {Dialog, DialogContent, DialogTrigger} from '@/components/ui/dialog'
import {Button} from '@/components/ui/button'
import {Trash} from 'lucide-react'
import {useEffect, useState} from 'react'
import {useToast} from "@/hooks/use-toast"
import axios from 'axios'
import {API_ROUTES} from "@/utils/apiRoutes";
import {useAuth} from "@/hooks/use-auth";
import {useRouter} from "next/navigation";

interface DeletePollDialogProps {
    pollId: string
    onDeleteSuccess: () => void
}

const DeletePollDialog = ({pollId, onDeleteSuccess}: DeletePollDialogProps) => {
    const {user, loading} = useAuth()
    const router = useRouter()
    const {toast} = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)  // State to control dialog visibility

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login')
        }
    }, [user, loading, router])

    const handleDeletePoll = async () => {
        if (!user) return
        setIsSubmitting(true)
        try {
            const {data} = await axios.post(API_ROUTES.POLLS.DELETE_POLL(pollId), {
                userId: user.id
            });
            if (data.success) {
                toast({
                    title: 'Poll deleted successfully',
                    description: 'The poll has been deleted.',
                })
                onDeleteSuccess()

                setIsDialogOpen(false)
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: 'Error',
                description: error instanceof Error ? error.message : 'Something went wrong',
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button
                    className="w-4 h-4 text-red-500 cursor-pointer"
                    size="icon"
                    onClick={e => {
                        e.stopPropagation()
                        setIsDialogOpen(true)
                    }}
                >
                    <Trash className="h-4 w-4"/>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Are you sure you want to delete this poll?</h3>
                    <p className="text-sm text-gray-500">This action cannot be undone.</p>
                </div>
                <div className="flex gap-4 mt-4">
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => setIsDialogOpen(false)} // Close dialog if user cancels
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        className="w-full bg-red-600 text-white"
                        onClick={handleDeletePoll}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Deleting...' : 'Yes, Delete'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default DeletePollDialog
