import Link from 'next/link'
import {LoginForm} from "@/components/auth/LoginForm";
import Image from "next/image";

export default function LoginPage() {
    return (
        <div className={'bg-gray-50 dark:bg-gray-900'}>
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                    <Image className="w-8 h-8 mr-2" src="/logo.png" width={100} height={100}
                         alt="logo"/>
                    Pollify
                </a>
                <div
                    className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Sign in to your account
                        </h1>
                        <LoginForm/>
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                            Don’t have an account yet? <Link href="/signup"
                                                             className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign
                            up</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>

    )
}