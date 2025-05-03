'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {Button} from './ui/button'
import {useAuth} from "@/context/auth-context";
import Image from 'next/image';

export function SiteHeader() {
    const pathname = usePathname()
    const {user, isLoading, signOut} = useAuth()

    if (isLoading) return null // or loading spinner

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center space-x-6">
                    <Link href={'/'}>
                        <Image src={'/logo.png'} alt="logo" width={100} height={100}
                               className={'h-[50px] w-auto object-contain'}/>
                    </Link>
                </div>
                <div className="flex items-center space-x-4">
                    <Link
                        href="/"
                        className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/' ? '' : 'text-muted-foreground'}`}
                    >
                        Home
                    </Link>
                    {user ? (
                        <>

                            <Link
                                href="/dashboard"
                                className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/dashboard' ? '' : 'text-muted-foreground'}`}
                            >
                                Dashboard
                            </Link>
                            <Button variant="outline" onClick={signOut}>
                                Sign Out
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="outline" asChild>
                                <Link href="/login">Login</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/signup">Sign Up</Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}