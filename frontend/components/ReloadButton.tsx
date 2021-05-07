import { createStyles, makeStyles, Theme } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import ReplayIcon from '@material-ui/icons/Replay'
import React from 'react'

interface Props {
  reload: () => {}
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    icon: {
      marginRight: theme.spacing(1),
    },
  }),
)

const ReloadButton: React.FC<Props> = (props: Props) => {
  const classes = useStyles()
  const reload = () => {
    props.reload()
  }

  return (
    <Button onClick={reload}>
      <ReplayIcon className={classes.icon} /> Reload
    </Button>
  )
}

export default ReloadButton
