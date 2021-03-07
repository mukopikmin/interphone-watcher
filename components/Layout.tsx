import React, { ReactNode } from 'react'
import Head from 'next/head'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import Header from './Header'

type Props = {
  children?: ReactNode
  title?: string
}

const Layout = ({ children, title = 'Interphone Watcher' }: Props) => (
  <>
    <CssBaseline />
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <Header />
    <Container maxWidth="md">
      <>{children}</>
    </Container>
  </>
)

export default Layout
