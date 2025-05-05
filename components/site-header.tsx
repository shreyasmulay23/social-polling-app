'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'
import { useAuth } from "@/context/auth-context"
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export function SiteHeader() {
    const pathname = usePathname()
    const { user, isLoading, signOut } = useAuth()
    const [isOpen, setIsOpen] = useState(false)

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
        <header className="sticky top-0 z-40 w-full border-b bg-background">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center space-x-6">
                    <Link href={'/'} onClick={closeMenu}>
                        <Image
                            src={'/logo.png'}
                            alt="logo"
                            width={100}
                            height={100}
                            className={'h-[50px] w-auto object-contain'}
                        />
                    </Link>
                </div>

                {/* Desktop Navigation - hidden on mobile */}
                <nav className="hidden md:flex items-center space-x-4">
                    {navLinks}
                </nav>

                {/* Mobile Navigation Button - hidden on desktop */}
                <div className="md:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 rounded-md text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu - appears below header when open */}
            <div className={`md:hidden bg-background border-t transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <div className="container py-4 flex flex-col space-y-4">
                    {navLinks}
                </div>
            </div>
        </header>
    )
}