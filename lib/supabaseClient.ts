import {createClientComponentClient} from '@supabase/auth-helpers-nextjs'

export const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    options: {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
        },
        // Optional: configure realtime settings
        realtime: {
            params: {
                eventsPerSecond: 10,
            },
        },
    },
})
