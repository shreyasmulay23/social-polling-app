// app/api/polls/route.ts
import {NextResponse} from 'next/server'
import {createServerSupabaseClient} from "@/lib/supabase/server";

export async function GET() {
    const supabase = createServerSupabaseClient()
    const {
        data: {user},
        error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
        console.error('User fetch error:', userError)
        return NextResponse.json([], {status: 401})
    }

    const {data: pollsRaw, error} = await supabase
        .from("polls")
        .select(`
    id, question, user_id, created_at,
    options ( id, text, poll_id ),
    votes ( id, poll_id, user_id, option_id )
  `)
        .order("created_at", {ascending: false});

    if (error) return NextResponse.json({error}, {status: 500});

    const polls = pollsRaw.map((poll) => {
        const voteCounts = poll.options.map((opt) => {
            const count = poll.votes.filter((v) => v.option_id === opt.id).length;
            return {
                ...opt,
                vote_count: count,
            };
        });

        const total_votes = voteCounts.reduce((sum, opt) => sum + opt.vote_count, 0);

        const enrichedOptions = voteCounts.map((opt) => ({
            ...opt,
            percentage: total_votes > 0 ? Math.round((opt.vote_count / total_votes) * 100) : 0,
        }));

        return {
            ...poll,
            total_votes,
            options: enrichedOptions,
            user_has_voted: poll.votes.some((v) => v.user_id === user.id),
        };
    });

    return NextResponse.json(polls);

    /* const {data, error} = await supabase
         .from('polls')
         .select(`
       *,
       options(*),
       votes(*)
     `)
         .order('created_at', {ascending: false})

     if (error) {
         console.error('Poll fetch error:', error)
         return NextResponse.json([], {status: 500})
     }

     // Enrich poll data with vote counts and percentage
     const enrichedPolls: PollWithVotes[] = data.map((poll) => {
         const total_votes = poll.votes.length
         const user_has_voted = poll.votes.some(
             (v: Vote) => v.user_id === user?.id
         )

         const options = poll.options.map((option: Option) => {
             const vote_count = poll.votes.filter((v: Vote) => v.option_id === option.id).length
             const percentage = total_votes > 0
                 ? Math.round((vote_count / total_votes) * 100)
                 : 0
             return {
                 ...option,
                 vote_count,
                 percentage,
             }
         })

         return {
             ...poll,
             options,
             total_votes,
             user_has_voted,
         }
     })

     return NextResponse.json(enrichedPolls)*/
}
