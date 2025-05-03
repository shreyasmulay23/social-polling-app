import {createBrowserClient} from "@supabase/ssr";

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            auth: {
                persistSession: true, // Crucial for session persistence
                autoRefreshToken: true,
                detectSessionInUrl: true,
            },
            cookies: {
                get(name: string) {
                    const value = `; ${document.cookie}`
                    const parts = value.split(`; ${name}=`)
                    return parts.length === 2 ? parts.pop()?.split(';').shift() : undefined
                },
                set(name: string, value: string, options: any) {
                    document.cookie = `${name}=${value}; ${Object.entries(options)
                        .map(([k, v]) => `${k}=${v}`)
                        .join('; ')}`
                },
                remove(name: string, options: any) {
                    document.cookie = `${name}=; Max-Age=-1; ${Object.entries(options)
                        .map(([k, v]) => `${k}=${v}`)
                        .join('; ')}`
                },
            }
        }
    )
}