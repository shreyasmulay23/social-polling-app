'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
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
                <label htmlFor="email"
                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your
                    email</label>
                <Input
                    id="email"
                    type="email"
                    value={email}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Please enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="password"
                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="••••••••"
                />
            </div>
            {error && (
                <p className="text-sm font-medium text-destructive">{error}</p>
            )}
            <div className="flex items-center justify-end">
                <Button variant="link" size="sm" className="px-0" asChild>
                    <Link href="#">Forgot password?</Link>
                </Button>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
            </Button>
        </form>
    )
}