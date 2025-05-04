'use client'

import {Dialog, DialogContent, DialogTrigger} from '@/components/ui/dialog'
import {Button} from '@/components/ui/button'
import {Trash} from 'lucide-react'
import {useState} from 'react'
import {useToast} from "@/hooks/use-toast"

interface DeletePollDialogProps {
    pollId: string
    onDeleteSuccess: () => void
}

const DeletePollDialog = ({pollId, onDeleteSuccess}: DeletePollDialogProps) => {
    const {toast} = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)  // State to control dialog visibility

    const handleDeletePoll = async () => {
        setIsSubmitting(true)
        try {
            const res = await fetch(`/api/poll/${pollId}/delete`, {
                method: 'DELETE',
            })
            if (!res.ok) {
                throw new Error('Failed to delete the poll')
            }

            toast({
                title: 'Poll deleted successfully',
                description: 'The poll has been deleted.',
            })
            onDeleteSuccess()

            setIsDialogOpen(false)

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
