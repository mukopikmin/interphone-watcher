import { useRouter } from 'next/router'
import Typography from '@material-ui/core/Typography'
import Layout from '../../../components/Layout'
import { useDeviceTemperatureTelemetry } from '../../../hooks/temperature'
import TemeperatureTelemetryChart from '../../../components/TemperatureTelemetryChart'

const DeviceTemperaturePage: React.FC = () => {
  const router = useRouter()
  const id = router.query.id as string
  const { data: telemetry } = useDeviceTemperatureTelemetry(id)

  return (
    <Layout title="Temperature">
      <Typography variant="h6" gutterBottom>
        {id}
      </Typography>

      {telemetry && <TemeperatureTelemetryChart telemetry={telemetry} />}
    </Layout>
  )
}

export default DeviceTemperaturePage
