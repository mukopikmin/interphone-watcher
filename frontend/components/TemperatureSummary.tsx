import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { TemperatureDevice } from '../interfaces/temperature'

interface Props {
  device: TemperatureDevice
}

const TemperatureSummary = (props: Props) => {
  return (
    <Card>
      <CardContent>
        <Typography gutterBottom>{props.device.id}</Typography>

        <p>Temperature: {props.device.telemetry?.temperature}</p>
        <p>Humidity: {props.device.telemetry?.humidity}</p>
        <p>Timestamp: {props.device.telemetry?.timestamp.format()}</p>
      </CardContent>
    </Card>
  )
}

export default TemperatureSummary
