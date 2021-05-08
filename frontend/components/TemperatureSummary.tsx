import { createStyles, makeStyles, Theme } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import { useDeviceTemperatureTelemetry } from '../hooks/temperature'
import { TemperatureDevice } from '../interfaces/temperature'
import TemeperatureTelemetryChart from './TemperatureTelemetryChart'

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
  })
)

const TemperatureSummary: React.FC<Props> = (props: Props) => {
  const classes = useStyles()
  const { data: telemetry } = useDeviceTemperatureTelemetry(props.device.id)

  return (
    <Card>
      <CardContent>
        <Typography gutterBottom>{props.device.id}</Typography>

        <div className={classes.container}>
          <div className={classes.telemetry}>
            <Typography variant="h4">
              {props.device.telemetry?.temperature}
              <small>℃</small>
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              Temperature
            </Typography>
          </div>

          <div className={classes.telemetry}>
            <Typography variant="h4">
              {props.device.telemetry?.humidity}
              <small>%</small>
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              Humidity
            </Typography>
          </div>
        </div>

        <Typography variant="caption" gutterBottom>
          {props.device.telemetry?.timestamp.format()}
        </Typography>

        {telemetry && <TemeperatureTelemetryChart telemetry={telemetry} />}
      </CardContent>
    </Card>
  )
}

export default TemperatureSummary
