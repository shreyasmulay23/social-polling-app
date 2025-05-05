'use client';

import {PollWithVotes} from '@/types';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {VoteForm} from './VoteForm';

type PollDialogProps = {
    poll: PollWithVotes;
    open: boolean;
    onCloseAction: () => void;
};

export default function PollDialog({poll, open, onCloseAction}: PollDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onCloseAction}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden p-6">
                <DialogHeader>
                    <DialogTitle>Poll</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Select the option that best represents your preference. You can only vote once.
                </DialogDescription>
                <h2 className="text-xl font-bold mb-4">{poll.question}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold mb-2">Options</h4>
                        {!poll.user_has_voted ? (
                            <VoteForm pollId={poll.id} options={poll.options} selectedOptionId={poll.user_option_id} onSuccessAction={onCloseAction}/>
                        ) : (
                            <>
                                <VoteForm pollId={poll.id} options={poll.options}
                                          selectedOptionId={poll.user_option_id} onSuccessAction={onCloseAction}/>
                            </>
                        )}
                    </div>

                    {/* Bar Chart Section */}
                    <div>
                        <h4 className="font-semibold mb-2">Poll Results</h4>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={poll.options}>
                                <XAxis dataKey="text"/>
                                <YAxis/>
                                <Tooltip/>
                                <Bar dataKey="vote_count" fill="#4f46e5"/>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
