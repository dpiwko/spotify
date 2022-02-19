import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'
import '../styles/globals.css'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </SessionProvider>
  )
}

export default MyApp
