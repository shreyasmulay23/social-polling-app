import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'

export const createServerSupabaseClient = () => {
    const cookieStore = cookies() // DO NOT await this
    return createServerComponentClient<Database>({ cookies: () => cookieStore })
}
