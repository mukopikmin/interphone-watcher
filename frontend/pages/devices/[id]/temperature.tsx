import { useRouter } from 'next/router'
import Typography from '@material-ui/core/Typography'
import Layout from '../../../components/Layout'
import {
  useTemperatureDeviceTelemetry,
  useTemperatureDevice,
} from '../../../hooks/temperature'
import TemeperatureTelemetryChart from '../../../components/TemperatureTelemetryChart'

const DeviceTemperaturePage: React.FC = () => {
  const router = useRouter()
  const id = router.query.id as string
  const { data: device } = useTemperatureDevice(id)
  const { data: telemetry } = useTemperatureDeviceTelemetry(id)

  return (
    <Layout title="Temperature">
      <Typography variant="h6">{device?.metadata.location}</Typography>
      <Typography variant="caption">{device?.id}</Typography>

      {telemetry && <TemeperatureTelemetryChart telemetry={telemetry} />}
    </Layout>
  )
}

export default DeviceTemperaturePage
