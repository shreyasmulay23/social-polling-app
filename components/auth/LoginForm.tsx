'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import Link from 'next/link'
import {supabase} from '@/lib/supabaseClient'

// import {supabase} from "@/lib/supabase";

export function LoginForm() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            await supabase.auth.signInWithPassword({
                email,
                password,
            })
            // ✅ Double-check session with getUser()
            const {data: userData, error: userError} = await supabase.auth.getUser()

            if (userError || !userData.user) {
                setError('Login failed. No active user session.')
                return
            }

            router.refresh()
            setTimeout(() => {
                router.push('/dashboard');
            }, 100);

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('Something went wrong.')
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                />
            </div>
            {error && (
                <p className="text-sm font-medium text-destructive">{error}</p>
            )}
            <div className="flex items-center justify-end">
                <Button variant="link" size="sm" className="px-0" asChild>
                    <Link href="/forgot-password">Forgot password?</Link>
                </Button>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
            </Button>
        </form>
    )
}