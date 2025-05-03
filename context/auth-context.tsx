'use client'

import {createContext, useContext, useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {User} from '@supabase/supabase-js'
import {supabase} from "@/lib/supabaseClient";

type AuthContextType = {
    user: User | null,
    isLoading: boolean,
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    signOut: async () => {
    },
})

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        let isMounted = true

        const getSession = async () => {
            const {data: {session}} = await supabase.auth.getSession()
            if (isMounted) {
                setUser(session?.user ?? null)
                setIsLoading(false)
            }
        }

        // Destructure to get the subscription directly
        const {data: {subscription}} = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (!isMounted) return

                console.log('Auth state changed:', event, session)
                setUser(session?.user ?? null)
                setIsLoading(false)

                if (event === 'SIGNED_IN') {
                    router.refresh()
                }
            }
        )

        // Get the session initially
        getSession()

        // Cleanup function
        return () => {
            isMounted = false
            if (subscription && typeof subscription.unsubscribe === 'function') {
                subscription.unsubscribe()  // Ensure unsubscribe is called correctly
            }
        }
    }, [router])

    const signOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <AuthContext.Provider value={{user, isLoading, signOut}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
