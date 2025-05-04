import {NextRequest, NextResponse} from 'next/server'
import {createServerSupabaseClient} from '@/lib/supabase/server'

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
