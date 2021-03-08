import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import Link from 'next/link'
import Container from '@material-ui/core/Container'

const useStyles = makeStyles((_theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: 80,
  },
  logo: {
    height: 48,
    verticalAlign: 'middle',
  },
}))

export default function ButtonAppBar() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <Container maxWidth="md">
            <span>
              <Link href={'/'}>
                <img
                  className={classes.logo}
                  src="/static/icons/icon-192x192.png"
                  alt=""
                />
              </Link>
            </span>
            <Link href={'/'} passHref>
              <Button color="inherit" component="a">
                Interphone Watcher
              </Button>
            </Link>
          </Container>
        </Toolbar>
      </AppBar>
    </div>
  )
}
