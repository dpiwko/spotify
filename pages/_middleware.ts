import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

export async function middleware(req: any) {
  const { pathname } = req.nextUrl
  const token = await getToken({
    req,
    secret: process.env.JWT_SECRET,
  })

  if (pathname !== '/login' && !token) {
    return NextResponse.redirect('/login')
  }

  if (pathname === '/login' && token) {
    return NextResponse.redirect('/')
  }

  if (pathname.includes('/api/auth') || token) {
    return NextResponse.next()
  }
}
