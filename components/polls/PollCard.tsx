'use client';

import {PollWithVotes} from '@/types';
import {Card} from '@/components/ui/card';
import {CalendarIcon, CheckCircle2Icon, CircleDashedIcon} from 'lucide-react';
import {fromNow} from "@/utils/fromNow";

type PollCardProps = {
    poll: PollWithVotes;
    onClickAction: (poll: PollWithVotes) => void;
};

export default function PollCard({poll, onClickAction}: PollCardProps) {
    return (
        <Card
            onClick={() => onClickAction(poll)}
            className="p-5 bg-gray-900 backdrop-blur-md rounded-2xl shadow-md border border-white/10 hover:shadow-xl hover:border-indigo-400 transition cursor-pointer"
        >
            <div className="flex flex-col gap-3 h-full justify-between">
                {/* Question */}
                <h3 className="text-lg font-semibold text-white">{poll.question}</h3>

                {/* Stats */}
                <div className="flex gap-5 items-center justify-between text-sm text-slate-300 mt-2">
                    <div className="flex items-center gap-1">
                        <CalendarIcon size={16}/>
                        <span>{fromNow(poll.created_at)}</span>
                    </div>

                    <div className="flex items-center gap-1">
                        {poll.user_has_voted ? (
                            <CheckCircle2Icon size={16} className="text-green-400"/>
                        ) : (
                            <CircleDashedIcon size={16} className="text-yellow-300"/>
                        )}
                        <span>{poll.user_has_voted ? 'Voted' : 'Not Voted'}</span>
                    </div>

                    <span className="text-indigo-300 font-semibold">{poll.total_votes} votes</span>
                </div>
            </div>
        </Card>
    );
}