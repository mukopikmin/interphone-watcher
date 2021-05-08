import { createStyles, makeStyles, Theme } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import CardActions from '@material-ui/core/CardActions'
import Link from 'next/link'
import Button from '@material-ui/core/Button'
import React from 'react'
import { TemperatureDevice } from '../interfaces/temperature'

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

  return (
    <Card>
      <CardContent>
        <Typography>{props.device.id}</Typography>
        <Typography variant="caption" gutterBottom>
          {props.device.telemetry?.timestamp.format()}
        </Typography>

        <div className={classes.container}>
          <div className={classes.telemetry}>
            <Typography variant="h4">
              {props.device.telemetry?.temperature}
              <small>℃</small>
            </Typography>
            <Typography variant="subtitle2">Temperature</Typography>
          </div>

          <div className={classes.telemetry}>
            <Typography variant="h4">
              {props.device.telemetry?.humidity}
              <small>%</small>
            </Typography>
            <Typography variant="subtitle2">Humidity</Typography>
          </div>
        </div>
      </CardContent>

      <CardActions>
        <Link href={`/devices/${props.device.id}/temperature`} passHref>
          <Button color="inherit" component="a">
            Detail
          </Button>
        </Link>
      </CardActions>
    </Card>
  )
}

export default TemperatureSummary
