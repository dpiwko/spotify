import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

export async function middleware(req: any) {
  const { pathname } = req.nextUrl
  const url = req.nextUrl.clone()
  const token = await getToken({
    req,
    secret: process.env.JWT_SECRET,
  })

  if (pathname === '/login' && token) {
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  if (pathname.includes('/api/auth') || token) {
    return NextResponse.next()
  }

  if (pathname !== '/login' && !token) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
}
