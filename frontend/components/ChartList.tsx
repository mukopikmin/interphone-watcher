import Typography from '@material-ui/core/Typography'
import { useEffect, useState } from 'react'
import TimeSeriesChart, {
  TimeSeriesDataProp,
} from '@/components/TimeSeriesChart'
import { TemperatureTelemetry } from '@/models/firestore'

interface Props {
  telemetry?: TemperatureTelemetry[]
  loading: boolean
}

const ChartList: React.FC<Props> = (props: Props) => {
  const { telemetry, loading } = props
  const [temperature, setTemperature] = useState<TimeSeriesDataProp[]>([])
  const [humidity, setHumidity] = useState<TimeSeriesDataProp[]>([])
  const [brightness, setBrightness] = useState<TimeSeriesDataProp[]>([])

  useEffect(() => {
    if (!telemetry) {
      return
    }

    setTemperature(
      telemetry.map((t) => ({
        value: t.temperature,
        timestamp: t.timestamp,
      }))
    )
    setHumidity(
      telemetry.map((t) => ({
        value: t.humidity,
        timestamp: t.timestamp,
      }))
    )
    setBrightness(
      telemetry.map((t) => ({
        value: t.brightness,
        timestamp: t.timestamp,
      }))
    )
  }, [telemetry])

  return (
    <>
      <Typography variant="subtitle1">Temperature</Typography>
      <TimeSeriesChart
        name="Temperature"
        loading={loading}
        unit="℃"
        telemetry={temperature}
      />
      <Typography variant="subtitle1">Humidity</Typography>
      <TimeSeriesChart
        name="Humidity"
        loading={loading}
        unit="%"
        telemetry={humidity}
      />
      <Typography variant="subtitle1">Brightness</Typography>
      <TimeSeriesChart
        name="Brightness"
        loading={loading}
        unit="Lux"
        telemetry={brightness}
      />
    </>
  )
}

export default ChartList
