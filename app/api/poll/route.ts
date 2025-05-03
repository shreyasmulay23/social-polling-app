import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'  // Ensure you import supabase client correctly

export async function POST(request: Request) {
    try {
        const { question, options } = await request.json()

        // Create server-side Supabase client
        const supabase = createServerSupabaseClient()

        // 1. Authenticate and get the logged-in user
        const { data: authData, error: authError } = await supabase.auth.getUser()

        if (authError || !authData) {
            throw new Error('User not authenticated')
        }

        // 2. Create the poll in the database
        const { data: poll, error: pollError } = await supabase
            .from('polls')
            .insert({ question, user_id: authData.user.id })
            .select()
            .single()

        if (pollError) throw pollError

        // 3. Create options for the poll (filter out empty options)
        const optionsData = options
            .filter((text: string) => text.trim() !== '')
            .map((text: string) => ({
                text,
                poll_id: poll.id,
            }))

        const { error: optionsError } = await supabase
            .from('options')
            .insert(optionsData)

        if (optionsError) {
            // Rollback: Delete the poll if options creation fails
            await supabase.from('polls').delete().eq('id', poll.id)
            throw optionsError
        }

        // Return the poll ID as a response
        return NextResponse.json({ pollId: poll.id })

    } catch (error) {
        // Error handling
        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json(
            { error: 'Unknown error occurred' },
            { status: 500 }
        )
    }
}
