import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {LoginForm} from "@/components/auth/LoginForm";

export default function LoginPage() {
    return (
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Welcome back
                </h1>
                <p className="text-sm text-muted-foreground">
                    Enter your email and password to sign in
                </p>
            </div>
            <LoginForm />
            <div className="flex items-center justify-center gap-2">
        <span className="text-sm text-muted-foreground">
          Don&apos;t have an account?
        </span>
                <Button variant="link" className="px-0" asChild>
                    <Link href="/signup">Sign up</Link>
                </Button>
            </div>
        </div>
    )
}