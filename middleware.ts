import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { pathname } = request.nextUrl

  // Admin routes: protected by cookie only (no Supabase auth needed)
  if (pathname.startsWith("/admin")) {
    const adminAuth = request.cookies.get("admin_auth")
    if (!adminAuth || adminAuth.value !== process.env.ADMIN_SECRET) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    return supabaseResponse
  }

  const { data: { user } } = await supabase.auth.getUser()

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup")
  const isPublicPage =
    pathname === "/" ||
    pathname.startsWith("/search") ||
    pathname.startsWith("/dentiste") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/ajouter-cabinet") ||
    pathname.startsWith("/a-propos") ||
    pathname.startsWith("/faq") ||
    pathname.startsWith("/mentions-legales") ||
    pathname.startsWith("/politique-confidentialite")

  // Redirect unauthenticated users trying to access protected routes
  if (!user && !isAuthPage && !isPublicPage) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Redirect authenticated users away from auth pages to dashboard
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
