import { NextResponse } from 'next/server'
import {supabase} from "@/lib/supabaseClient";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json()

        // Basic validation
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            )
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            )
        }

        // Sign up user
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        })

        if (authError) {
            return NextResponse.json({ error: authError.message }, { status: 400 })
        }

        // Add user to public.users table
        if (authData.user) {
            const { error: dbError } = await supabase
                .from('users')
                .insert({
                    id: authData.user.id,
                    email: authData.user.email,
                    created_at: new Date().toISOString(),
                })

            if (dbError) {
                console.error('Failed to add user to public.users:', dbError)
                // Don't fail the request - the user is authenticated even if public record fails
            }
        }

        // Return success response
        return NextResponse.json({
            user: authData.user,
            session: authData.session,
        })
    } catch (error) {
        console.error('Signup error:', error)
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        )
    }
}