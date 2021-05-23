import { createStyles, makeStyles, Theme } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import ReplayIcon from '@material-ui/icons/Replay'
import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'

interface Props {
  reload: () => void
  loading: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    icon: {
      marginRight: theme.spacing(1),
    },
    wrapper: {
      margin: theme.spacing(1),
      position: 'relative',
    },
    buttonProgress: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
  })
)

const ReloadButton: React.FC<Props> = (props: Props) => {
  const classes = useStyles()

  return (
    <span className={classes.wrapper}>
      <Button onClick={props.reload} disabled={props.loading}>
        <ReplayIcon className={classes.icon} /> Reload
      </Button>
      {props.loading && (
        <CircularProgress size={24} className={classes.buttonProgress} />
      )}
    </span>
  )
}

export default ReloadButton
