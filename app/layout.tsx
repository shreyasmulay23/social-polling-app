import type {Metadata} from "next";
import {Space_Grotesk} from "next/font/google";
import "../styles/globals.css";
import {SiteHeader} from "@/components/site-header";
import {SiteFooter} from "@/components/site-footer";
import {AuthProvider} from "@/context/auth-context";
import {Toaster} from "@/components/ui/toaster"

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Pollify – Create Polls, Get Insights Instantly",
    description: "Pollify helps you create, share, and analyze polls in real-time. Perfect for teams, creators, and communities.",
    openGraph: {
        title: 'Pollify – Create Polls, Get Insights Instantly',
        description: 'Create beautiful, data-rich polls and share them instantly. Trusted by teams and creators worldwide.',
        url: 'https://social-polling-app-seven.vercel.app/',
        siteName: 'Pollify',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Pollify – Create Polls, Get Insights Instantly',
        description: 'Create beautiful, data-rich polls and share them instantly. Trusted by teams and creators worldwide.'
    },
    metadataBase: new URL('https://social-polling-app-seven.vercel.app/'),
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <head>
            <meta name="theme-color" content="#6C63FF"/>
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
            <link rel="manifest" href="/site.webmanifest"/>
        </head>
        <body className={`${spaceGrotesk.className}`}>
        <AuthProvider>
            <div className="relative flex min-h-screen flex-col">
                <SiteHeader/>
                <main className="flex-1">
                    {children}
                    <Toaster/>
                </main>
                <SiteFooter/>
            </div>
        </AuthProvider>
        </body>
        </html>
    );
}
