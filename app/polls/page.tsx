import {createClient} from '@/lib/supabase'
import {PollList} from '@/components/polls/poll-list'
import {SearchPolls} from '@/components/polls/search-polls'
import {CategoryFilter} from '@/components/polls/category-filter'

interface SearchParams {
    query?: string
    category?: string
}

interface PollsPageProps {
    searchParams?: Promise<SearchParams>
}

export default async function PollsPage({searchParams}: PollsPageProps) {
    // Await for the promise to resolve and get the values of query and category
    const {query = '', category = ''} = searchParams ? await searchParams : {}
    const supabase = createClient()

    // Base query
    let pollQuery = supabase
        .from('polls')
        .select(`
      *,
      options(*),
      votes(*),
      user:users(*)
    `)
        .order('created_at', {ascending: false})

    // Apply search filter
    if (query) {
        pollQuery = pollQuery.textSearch('question', query)
    }

    // Apply category filter
    if (category) {
        pollQuery = pollQuery.eq('category', category)
    }

    console.log(pollQuery)

    return (
        <div className="container py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">Discover Polls</h1>
                <div className="flex flex-col md:flex-row gap-4">
                    <SearchPolls/>
                    <CategoryFilter/>
                </div>
            </div>

            <PollList />
        </div>
    )
}