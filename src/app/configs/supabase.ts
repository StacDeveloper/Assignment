import { createClient } from "@supabase/supabase-js";

const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true
    },
    realtime: {
        params: {
            eventsPerSecond: 10,
        }
    },
    global: {
        headers: {
            'X-Client-Info': "supabase-js-web"
        }
    }
})
if (supabase) {
    console.log("Supabase connected")
}