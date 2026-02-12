import { supabase } from "@/app/configs/supabase";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (code) {
        await supabase.auth.exchangeCodeForSession(code)
    }
    return NextResponse.redirect(new URL("/", requestUrl.origin))
}
