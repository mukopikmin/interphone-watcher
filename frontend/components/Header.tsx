import React from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import Link from 'next/link'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: 70,
  },
  logo: {
    height: 36,
    verticalAlign: 'middle',
    marginRight: theme.spacing(1),
  },
}))

const Header: React.FC = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar variant="dense">
          <Link href="/" passHref>
            <Button color="inherit">
              <img
                data-testid="logo"
                className={classes.logo}
                src="/static/icons/icon-192x192.png"
                alt="logo"
              />
              House Dashboard
            </Button>
          </Link>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default Header
