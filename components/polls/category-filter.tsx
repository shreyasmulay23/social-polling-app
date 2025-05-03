'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {pollConstants} from "@/components/polls/consants";


export function CategoryFilter() {
    const searchParams = useSearchParams()
    const router = useRouter()

    return (
        <Select
            defaultValue={searchParams.get('category')?.toString() || ''}
            onValueChange={(value) => {
                const params = new URLSearchParams(searchParams)
                if (value) {
                    params.set('category', value)
                } else {
                    params.delete('category')
                }
                router.replace(`/polls?${params.toString()}`)
            }}
        >
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
                {pollConstants.categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                        {category.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}