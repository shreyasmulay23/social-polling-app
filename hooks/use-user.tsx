'use client'

import {useEffect, useState} from 'react'
import {User} from '@supabase/supabase-js'
import {supabase} from "@/lib/supabaseClient";

export function useUser() {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            const {data: {user}} = await supabase.auth.getUser()
            setUser(user)
            setIsLoading(false)
        }

        fetchUser()

        const {data: {subscription}} = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    return {user, isLoading}
}