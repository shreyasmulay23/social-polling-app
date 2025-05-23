'use client'

import {useEffect, useState} from 'react'
import {User} from '@supabase/supabase-js'
import {supabase} from "@/lib/supabase/client";

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getSession = async () => {
            const {data: {session}} = await supabase.auth.getSession()
            setUser(session?.user ?? null)
            setLoading(false)
        }

        getSession()

        const {data: {subscription}} = supabase.auth.onAuthStateChange(
            (event, session) => {
                setUser(session?.user ?? null)
            }
        )

        return () => subscription.unsubscribe()
    }, [supabase])

    return {user, loading}
}