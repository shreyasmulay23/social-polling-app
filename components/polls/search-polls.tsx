'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useDebouncedCallback } from 'use-debounce'

export function SearchPolls() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams ?? '')
        if (term) {
            params.set('query', term)
        } else {
            params.delete('query')
        }
        router.replace(`/polls?${params.toString()}`)
    }, 300)

    return (
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Search polls..."
                className="pl-9"
                defaultValue={searchParams ? searchParams.get('query')?.toString() : ''}
                onChange={(e) => handleSearch(e.target.value)}
            />
        </div>
    )
}