'use client';

import {PollWithVotes} from '@/types';
import {Card} from '@/components/ui/card';
import {CalendarIcon, CheckCircle2Icon, CircleDashedIcon, CircleUser, EyeIcon} from 'lucide-react';
import {fromNow} from "@/utils/fromNow";
import {useAuth} from "@/context/auth-context";
import {UpdatePollDialog} from "@/components/polls/UpdatePollDialog";
import DeletePollDialog from "@/components/polls/DeletePollDialog";

type PollCardProps = {
    poll: PollWithVotes;
    onClickAction: (arg: PollWithVotes | string) => void;
};

export default function PollCard({poll, onClickAction}: PollCardProps) {
    const {user} = useAuth()
    return (
        <Card
            className="p-5 bg-gray-900 backdrop-blur-md rounded-2xl shadow-md border border-white/10 hover:shadow-xl hover:border-indigo-400 transition relative"
        >
            <div className="flex flex-col gap-3 h-full justify-between">
                {/* Question */}
                <h3 className="text-lg font-semibold text-white">{poll.question}</h3>
                {poll.user_id === user?.id && (
                    <span
                        className="text-xs font-medium text-blue-600 px-2.5 py-0.5 rounded-sm absolute right-3 top-3 shadow-sm">
                        <CircleUser size={16}/>
                    </span>
                )}
                {/* Stats */}
                <div className="flex gap-5 items-center justify-between text-sm text-slate-300 mt-2 flex-wrap">
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
                    <div className={'flex items-center gap-3'}>
                        <EyeIcon
                            className="w-4 h-4 text-green-400 cursor-pointer"
                            onClick={() => onClickAction(poll)}
                            strokeWidth={1.8}
                        />
                        {poll.user_id === user?.id && <>
                            <UpdatePollDialog poll={poll} onSuccess={() => onClickAction('CLOSE_DIALOG')}/>
                            <DeletePollDialog pollId={poll.id} onDeleteSuccess={() => onClickAction('CLOSE_DIALOG')}/>
                        </>}
                    </div>

                </div>
            </div>
        </Card>
    );
}