import { useRouter } from 'next/router'
import Typography from '@material-ui/core/Typography'
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import Layout from '../../../components/Layout'
import {
  useTemperatureDeviceTelemetry,
  useTemperatureDevice,
  useTemperatureDevices,
} from '../../../hooks/temperature'
import BrightnessChart from '../../../components/BrightnessChart'
import TemeperatureTelemetryChart from '../../../components/TemperatureTelemetryChart'
import DeviceSelect from '../../../components/DeviceSelect'
import { Device } from '../../../models/iotcore'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    deviceLocation: {
      verticalAlign: 'bottom',
      marginLeft: theme.spacing(2),
    },
  })
)

const DeviceTemperaturePage: React.FC = () => {
  const classes = useStyles()
  const router = useRouter()
  const id = router.query.id as string
  const { data: device } = useTemperatureDevice(id)
  const { data: telemetry } = useTemperatureDeviceTelemetry(id)
  const { data: devices } = useTemperatureDevices()
  const title = `Temperature | ${device?.metadata.location}`
  const onSelectDevice = (device: Device) => {
    router.push(`/devices/${device.id}/temperature`)
  }

  return (
    <Layout title={title}>
      <div>
        <DeviceSelect devices={devices} onSelect={onSelectDevice} />
        <Typography
          display="inline"
          variant="subtitle1"
          className={classes.deviceLocation}
        >
          {device?.metadata.location}
        </Typography>
      </div>

      {telemetry && <TemeperatureTelemetryChart telemetry={telemetry} />}
      {telemetry && <BrightnessChart telemetry={telemetry} />}
    </Layout>
  )
}

export default DeviceTemperaturePage
