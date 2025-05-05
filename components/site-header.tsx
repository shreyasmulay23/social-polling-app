'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'
import { useAuth } from "@/context/auth-context"
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

export function SiteHeader() {
    const pathname = usePathname()
    const { user, isLoading, signOut } = useAuth()
    const [isOpen, setIsOpen] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        return () => setIsMounted(false)
    }, [])

    if (isLoading) return null

    const closeMenu = () => setIsOpen(false)

    const navLinks = (
        <>
            <Link
                href="/"
                onClick={closeMenu}
                className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/' ? '' : 'text-muted-foreground'}`}
            >
                Home
            </Link>
            {user ? (
                <>
                    <Link
                        href="/dashboard"
                        onClick={closeMenu}
                        className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/dashboard' ? '' : 'text-muted-foreground'}`}
                    >
                        Dashboard
                    </Link>
                    <Button variant="outline" onClick={() => {
                        signOut()
                        closeMenu()
                    }}>
                        Sign Out
                    </Button>
                </>
            ) : (
                <>
                    <Button variant="outline" asChild>
                        <Link href="/login" onClick={closeMenu}>Login</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/signup" onClick={closeMenu}>Sign Up</Link>
                    </Button>
                </>
            )}
        </>
    )

    return (
        <header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href={'/'} onClick={closeMenu}>
                        <Image
                            src={'/logo.png'}
                            alt="logo"
                            width={100}
                            height={100}
                            className={'h-[50px] w-auto object-contain'}
                        />

                    </Link>
                    <h1 className={'text-xl font-bold'}>Pollify</h1>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-4">
                    {navLinks}
                </nav>

                {/* Mobile Navigation Button */}
                <div className="md:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 rounded-md text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
                        aria-label="Toggle menu"
                        aria-expanded={isOpen}
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu - using opacity instead of height for more reliable transitions */}
            {isMounted && (
                <div className={`md:hidden bg-background border-t transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible h-0'}`}>
                    <div className="container py-4 flex flex-col space-y-4 justiify-center items-center">
                        {navLinks}
                    </div>
                </div>
            )}
        </header>
    )
}