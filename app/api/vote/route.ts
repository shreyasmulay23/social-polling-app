import {NextResponse} from 'next/server'
import {createServerSupabaseClient} from '@/lib/supabase/server'

export async function POST(request: Request) {
    try {
        const {pollId, selectedOption} = await request.json()

        const supabase = createServerSupabaseClient()

        // 1. Authenticate the user
        const {data: authData, error: authError} = await supabase.auth.getUser()
        if (authError || !authData?.user) {
            return NextResponse.json(
                {error: 'You must be logged in to vote'},
                {status: 401}
            )
        }

        // 2. Check if the user has already voted
        const {count} = await supabase
            .from('votes')
            .select('*', {count: 'exact'})
            .eq('poll_id', pollId)
            .eq('user_id', authData.user.id)

        if (count && count > 0) {
            return NextResponse.json(
                {error: 'You have already voted on this poll'},
                {status: 400}
            )
        }

        // 3. Insert the vote
        const {error} = await supabase
            .from('votes')
            .insert({
                poll_id: pollId,
                option_id: selectedOption,
                user_id: authData.user.id,
            })

        if (error) {
            throw error
        }

        return NextResponse.json({message: 'Vote submitted!'})
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                {error: error.message},
                {status: 500}
            )
        }
        return NextResponse.json(
            {error: 'Unknown error occurred'},
            {status: 500}
        )
    }
}
