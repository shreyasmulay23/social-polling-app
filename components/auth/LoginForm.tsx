'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import Link from 'next/link'
import axios from "axios";
import Cookies from 'js-cookie'
import {supabase} from "@/lib/supabase/client";
import {API_ROUTES} from "@/utils/apiRoutes";
import {toast} from "@/hooks/use-toast";

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
            const {data} = await axios.post(API_ROUTES.AUTH.LOGIN, {email, password})
            const access_token = data?.session?.access_token
            const refresh_token = data?.session?.refresh_token
            if (access_token && refresh_token) {
                Cookies.set('supabase_access_token', data.session.access_token, {secure: true, sameSite: 'Strict'})
                Cookies.set('supabase_refresh_token', data.session.refresh_token, {secure: true, sameSite: 'Strict'})
                await supabase.auth.setSession({
                    access_token,
                    refresh_token
                });
                toast({
                    title: 'Logged In successfully',
                    description: 'Successfully logged in.',
                })
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const message = err.response?.data?.error?.message || 'Something went wrong';
                setError(message);
            } else {
                setError('Something went wrong.')
            }
            toast({
                variant: 'destructive',
                title: 'Oops! Something went wrong',
                description: 'Please try again later',
            })
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
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
            </Button>
        </form>
    )
}