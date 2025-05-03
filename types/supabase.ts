
// types/supabase.ts

export type Database = {
    public: {
        Tables: {
            polls: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    created_at: string
                    updated_at: string
                    user_id: string
                }
                Insert: {
                    title: string
                    description: string | null
                    user_id: string
                }
                Update: {
                    title?: string
                    description?: string | null
                }
            }
            options: {
                Row: {
                    id: string
                    poll_id: string
                    option_text: string
                }
                Insert: {
                    poll_id: string
                    option_text: string
                }
                Update: {
                    option_text?: string
                }
            }
            votes: {
                Row: {
                    id: string
                    user_id: string
                    option_id: string
                }
                Insert: {
                    user_id: string
                    option_id: string
                }
                Update: {
                    option_id?: string
                }
            }
        }
    }
}
