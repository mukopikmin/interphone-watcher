import { Device, DeviceConfig } from '../interfaces'
import { NotificationsOff, NotificationsActive } from '@material-ui/icons'
import Card from '@material-ui/core/Card'
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Link from 'next/link'

interface Props {
  devices?: Device[]
  configs?: (DeviceConfig | null)[]
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    progress: {
      display: 'flex',
      marginTop: theme.spacing(10),
      justifyContent: 'center',
    },
    icon: {
      size: 2,
    },
  })
)

const InterphoneSummary = (props: Props) => {
  const classes = useStyles()
  const deviceCount = props.configs?.length
  const isActive = !!props.configs
    ?.filter((config) => !!config)
    .map((config) => config?.sensorEnabled)
    .reduce((pre, cur) => pre || cur, false)
  const defaultDeviceId =
    props?.devices && props?.devices[0] ? props.devices[0].id : ''

  if (!props.configs) {
    return (
      <div className={classes.progress}>
        <CircularProgress />
      </div>
    )
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2">
          Interphone Notification
        </Typography>
        {isActive ? (
          <NotificationsActive fontSize="large" color="disabled" />
        ) : (
          <NotificationsOff fontSize="large" color="secondary" />
        )}
        <Typography>{deviceCount} active devices</Typography>
      </CardContent>

      <CardActions>
        <Link href={`/devices/${defaultDeviceId}`} passHref>
          <Button color="inherit" component="a">
            Settings
          </Button>
        </Link>
      </CardActions>
    </Card>
  )
}

export default InterphoneSummary
