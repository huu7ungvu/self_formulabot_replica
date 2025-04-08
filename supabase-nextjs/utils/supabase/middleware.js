import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function CheckMidlleware(request) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // refreshing the auth token
  // await supabase.auth.getUser()
  const {data:{user}, error} = await supabase.auth.getUser();

  // check if user is authenticated
  if (!user || error) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirected', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse
}