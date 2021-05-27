import { createStyles, makeStyles, Theme } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import CardActions from '@material-ui/core/CardActions'
import Link from 'next/link'
import Button from '@material-ui/core/Button'
import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import { TemperatureTelemetry } from '../models/temperature'
import { useTemperatureDeviceLastTelemetry } from '../hooks/temperature'
import { Device } from '../models/iotcore'

interface Props {
  device: Device
}

interface ValueProps {
  telemetry?: TemperatureTelemetry | null
  loading: boolean
}

const PLACEHOLDER = '-'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      justifyContent: 'space-around',
    },
    telemetry: {
      textAlign: 'center',
    },
    thresholdForm: {
      maxWidth: 100,
      marginRight: theme.spacing(1),
    },
    actions: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    unit: {
      marginLeft: theme.spacing(1),
    },
    title: {
      marginBottom: theme.spacing(2),
    },
    loading: {
      textAlign: 'center',
      padding: theme.spacing(1),
    },
  })
)

const SummaryValue: React.FC<ValueProps> = (props: ValueProps) => {
  const classes = useStyles()
  const { telemetry, loading } = props

  if (telemetry || !loading) {
    return (
      <div className={classes.container}>
        <div className={classes.telemetry}>
          <Typography variant="h4">
            {telemetry ? telemetry.temperature : PLACEHOLDER}
            <small className={classes.unit}>℃</small>
          </Typography>
          <Typography variant="subtitle2">Temperature</Typography>
        </div>

        <div className={classes.telemetry}>
          <Typography variant="h4">
            {telemetry ? telemetry.humidity : PLACEHOLDER}
            <small className={classes.unit}>%</small>
          </Typography>
          <Typography variant="subtitle2">Humidity</Typography>
        </div>

        <div className={classes.telemetry}>
          <Typography variant="h4">
            {telemetry ? telemetry.brightness : PLACEHOLDER}
            <small className={classes.unit}>Lux</small>
          </Typography>
          <Typography variant="subtitle2">Brightness</Typography>
        </div>
      </div>
    )
  }

  return (
    <div className={classes.loading}>
      <CircularProgress size={30} />
    </div>
  )
}

const TemperatureSummary: React.FC<Props> = (props: Props) => {
  const classes = useStyles()
  const { data: telemetry, isLoading } = useTemperatureDeviceLastTelemetry(
    props.device.id
  )

  return (
    <Card>
      <CardContent>
        <div className={classes.title}>
          <Typography>
            {props.device.metadata.location || PLACEHOLDER}
          </Typography>
          <Typography variant="caption">{props.device.id}</Typography>
        </div>

        <SummaryValue loading={isLoading} telemetry={telemetry} />
      </CardContent>

      <CardActions className={classes.actions}>
        <Link href={`/devices/${props.device.id}`} passHref>
          <Button color="inherit" component="a">
            Detail
          </Button>
        </Link>

        <Typography variant="caption">
          {telemetry?.timestamp.format('YYYY/MM/DD HH:mm')}
        </Typography>
      </CardActions>
    </Card>
  )
}

export default TemperatureSummary
