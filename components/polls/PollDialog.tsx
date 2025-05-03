// components/PollDialog.tsx
'use client';

import { PollWithVotes } from '@/types';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';

type PollDialogProps = {
    poll: PollWithVotes;
    open: boolean;
    onCloseAction: () => void;
};

export default function PollDialog({ poll, open, onCloseAction }: PollDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onCloseAction}>
            <DialogContent className="max-w-2xl">
                <h2 className="text-xl font-bold mb-4">{poll.question}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Voting Section */}
                    <div>
                        <h4 className="font-semibold mb-2">Options</h4>
                        {poll.options.map(option => (
                            <div
                                key={option.id}
                                className="flex justify-between items-center p-2 border rounded-md mb-2"
                            >
                                <span>{option.text}</span>
                                <span className="text-muted-foreground text-sm">
                  {option.vote_count} votes ({option.percentage}%)
                </span>
                            </div>
                        ))}

                        <Button disabled={poll.user_has_voted} className="mt-4 w-full">
                            {poll.user_has_voted ? 'You already voted' : 'Vote'}
                        </Button>
                    </div>

                    {/* Bar Chart Section */}
                    <div>
                        <h4 className="font-semibold mb-2">Poll Results</h4>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={poll.options}>
                                <XAxis dataKey="text" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="vote_count" fill="#4f46e5" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
