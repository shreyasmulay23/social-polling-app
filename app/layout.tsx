import type {Metadata} from "next";
import {Space_Grotesk} from "next/font/google";
import "../styles/globals.css";
import {SiteHeader} from "@/components/site-header";
import {SiteFooter} from "@/components/site-footer";
import {AuthProvider} from "@/context/auth-context";

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Pollify - Social Polling App",
    description: "Create and share polls with your friends in real-time'",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={`${spaceGrotesk.className}`}>
        <AuthProvider>
            <div className="relative flex min-h-screen flex-col">
                <SiteHeader />
                <main className="flex-1">{children}</main>
                <SiteFooter />
            </div>
        </AuthProvider>
        </body>
        </html>
    );
}
