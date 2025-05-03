import {NextRequest, NextResponse} from 'next/server'
import {createServerSupabaseClient} from '@/lib/supabase/server'

export async function DELETE(
    request: NextRequest,
    {params}: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    const pollId = (await params).id
    const supabase = createServerSupabaseClient()

    try {
        // 1. Verify authentication
        const {data: {user}, error: authError} = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json(
                {error: 'Unauthorized'},
                {status: 401}
            )
        }

        // 2. Verify poll ownership
        const {data: poll, error: pollError} = await supabase
            .from('polls')
            .select('user_id')
            .eq('id', pollId)
            .single()

        if (pollError || !poll) {
            return NextResponse.json(
                {error: 'Poll not found'},
                {status: 404}
            )
        }

        if (poll.user_id !== user.id) {
            return NextResponse.json(
                {error: 'Forbidden - You can only delete your own polls'},
                {status: 403}
            )
        }

        // Delete all options associated with the poll first
        const {error: deleteOptionsError} = await supabase
            .from('options')
            .delete()
            .eq('poll_id', pollId)

        if (deleteOptionsError) {
            console.error('Error deleting options:', deleteOptionsError)
            return NextResponse.json({message: 'Failed to delete poll options.'}, {status: 500})
        }

        // Now delete the poll itself
        const {error} = await supabase.from('polls').delete().eq('id', pollId)

        if (error) {
            console.error('Error deleting poll:', error)
            return NextResponse.json({message: 'Failed to delete poll.'}, {status: 500})
        }

        return NextResponse.json({message: 'Poll deleted successfully.'})
    } catch (error) {
        console.error('Poll deletion failed:', error)
        return NextResponse.json(
            {error: 'Internal server error'},
            {status: 500}
        )
    }
}

export async function PATCH(req: NextRequest, {params}: { params: Promise<{ pollId: string }> }) {
    const supabase = createServerSupabaseClient()
    const pollId = (await params).pollId
    const body = await req.json()
    const {question, options, originalOptions, hasVotes} = body

    // Update poll title
    const {error: updatePollError} = await supabase
        .from('polls')
        .update({question})
        .eq('id', pollId)

    if (updatePollError) {
        return NextResponse.json({error: 'Failed to update poll title'}, {status: 500})
    }

    // Update existing options
    for (let i = 0; i < originalOptions.length; i++) {
        const original = originalOptions[i]
        const updatedText = options[i]

        if (original.text !== updatedText) {
            await supabase
                .from('options')
                .update({text: updatedText})
                .eq('id', original.id)
        }
    }

    if (!hasVotes) {
        // Delete extra removed options
        const removed = originalOptions.slice(options.length)
        for (const ro of removed) {
            await supabase.from('options').delete().eq('id', ro.id)
        }

        // Add new options
        const newOptions = options.slice(originalOptions.length).filter((o: string) => o.trim() !== '')
        if (newOptions.length > 0) {
            await supabase.from('options').insert(
                newOptions.map((text: string) => ({text, poll_id: pollId}))
            )
        }
    }

    return NextResponse.json({success: true})
}
