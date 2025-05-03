import Link from 'next/link'

export function SiteFooter() {
    return (
        <footer className="border-t">
            <div
                className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <p className="text-center text-sm leading-loose md:text-left">
                        Made with 💗 from &nbsp;
                        <Link
                            href="https://github.com/shreyasmulay23"
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium underline underline-offset-4"
                        >
                            Shreyas Mulay
                        </Link>
                        . Hosted on{' '}
                        <Link
                            href="https://vercel.com"
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium underline underline-offset-4"
                        >
                            Vercel
                        </Link>
                        .
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    <Link
                        href="/terms"
                        className="text-sm text-muted-foreground hover:text-primary"
                    >
                        Terms
                    </Link>
                    <Link
                        href="/privacy"
                        className="text-sm text-muted-foreground hover:text-primary"
                    >
                        Privacy
                    </Link>
                    <Link
                        href="https://github.com/yourusername/pollify"
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-muted-foreground hover:text-primary"
                    >
                        GitHub
                    </Link>
                </div>
            </div>
        </footer>
    )
}