import {Button} from '@/components/ui/button'
import Link from 'next/link'

export default function AuthErrorPage() {
    return (
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight text-destructive">
                    Verification Failed
                </h1>
                <p className="text-sm text-muted-foreground">
                    The verification link is invalid or has expired.
                    Please try signing up again.
                </p>
            </div>
            <div className="flex justify-center gap-4">
                <Button asChild>
                    <Link href="/signup">Sign Up</Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/login">Login</Link>
                </Button>
            </div>
        </div>
    )
}