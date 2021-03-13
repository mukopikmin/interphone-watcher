import { createStyles, makeStyles, Theme } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import ReplayIcon from '@material-ui/icons/Replay'

interface Props {
  reload: Function
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    icon: {
      marginRight: theme.spacing(1),
    },
  })
)

const ReloadButton = (props: Props) => {
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
