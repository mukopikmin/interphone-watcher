import { createStyles, makeStyles, Theme } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import CardActions from '@material-ui/core/CardActions'
import Link from 'next/link'
import Button from '@material-ui/core/Button'
import React from 'react'
import { TemperatureDevice } from '../models/temperature'
import { useTemperatureDeviceLastTelemetry } from '../hooks/temperature'

interface Props {
  device: TemperatureDevice
}

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
  })
)

const TemperatureSummary: React.FC<Props> = (props: Props) => {
  const classes = useStyles()
  const { data: telemetry } = useTemperatureDeviceLastTelemetry(props.device.id)

  return (
    <Card>
      <CardContent>
        <div className={classes.title}>
          <Typography>{props.device.metadata.location}</Typography>
          <Typography variant="caption">{props.device.id}</Typography>
        </div>

        <div className={classes.container}>
          <div className={classes.telemetry}>
            <Typography variant="h4">
              {telemetry?.temperature}
              <small className={classes.unit}>℃</small>
            </Typography>
            <Typography variant="subtitle2">Temperature</Typography>
          </div>

          <div className={classes.telemetry}>
            <Typography variant="h4">
              {telemetry?.humidity}
              <small className={classes.unit}>%</small>
            </Typography>
            <Typography variant="subtitle2">Humidity</Typography>
          </div>
        </div>
      </CardContent>

      <CardActions className={classes.actions}>
        <Link href={`/devices/${props.device.id}/temperature`} passHref>
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
