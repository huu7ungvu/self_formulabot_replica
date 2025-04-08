import { CheckMidlleware } from '@/utils/supabase/middleware'

export async function middleware(request) {
  // update user's auth session
  return await CheckMidlleware(request)
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/settings/:path*", "/home/:path*"],
}