import { NotificationsOff, NotificationsActive } from '@material-ui/icons'
import Card from '@material-ui/core/Card'
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Link from 'next/link'
import Grid from '@material-ui/core/Grid'
import { Device, DeviceConfig } from '@/models/iotcore'

interface Props {
  devices?: Device[]
  configs?: (DeviceConfig | null)[]
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    progress: {
      display: 'flex',
      margin: theme.spacing(5),
      justifyContent: 'center',
    },
    icon: {
      fontSize: '3em',
      margin: theme.spacing(2),
    },
    gridItemIcon: {
      textAlign: 'center',
    },
    gridItemDescription: {},
  })
)

const InterphoneSummary: React.FC<Props> = (props: Props) => {
  const classes = useStyles()
  const deviceCount = props?.devices?.length
  const isActive = !!props.configs
    ?.filter((config) => !!config)
    .map((config) => config?.sensorEnabled)
    .reduce((pre, cur) => pre || cur, false)
  const defaultDeviceId =
    props?.devices && props?.devices[0] ? props.devices[0].id : ''

  if (!props.configs) {
    return (
      <Card>
        <CardContent>
          <Typography gutterBottom>Interphone Notification</Typography>
          <div className={classes.progress}>
            <CircularProgress />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <Typography gutterBottom>Interphone</Typography>

        <Grid container spacing={2}>
          <Grid item sm={6} xs={12} className={classes.gridItemIcon}>
            {isActive ? (
              <NotificationsActive className={classes.icon} color="disabled" />
            ) : (
              <NotificationsOff className={classes.icon} color="secondary" />
            )}
          </Grid>
          <Grid item sm={6} xs={12} className={classes.gridItemDescription}>
            <Typography variant="body2">
              {deviceCount || '?'} active device
              {deviceCount && deviceCount > 1 ? 's' : ' '}
            </Typography>
          </Grid>
        </Grid>
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
