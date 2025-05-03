import { NextResponse } from 'next/server'
import {supabase} from "@/lib/supabaseClient";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json()

        // 1. Authenticate
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (authError) throw authError

        // 2. Get user with error handling
        const getUser = async () => {
            // Try with .maybeSingle first
            const result = await supabase
                .from('users')
                .select('*')
                .eq('id', authData.user.id)
                .maybeSingle()

            if (result.error) throw result.error
            if (result.data) return result.data

            // If not found, try creating
            const { data, error } = await supabase
                .from('users')
                .insert({
                    id: authData.user.id,
                    email: authData.user.email,
                    created_at: new Date().toISOString(),
                })
                .select()
                .single()

            if (error) throw error
            return data
        }

        const userData = await getUser()

        return NextResponse.json({
            user: { ...authData.user, ...userData },
            session: authData.session,
        })

    } catch (error) {
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
