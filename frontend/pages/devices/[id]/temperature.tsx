import { useRouter } from 'next/router'
import Typography from '@material-ui/core/Typography'
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import { useEffect, useState } from 'react'
import RoomIcon from '@material-ui/icons/Room'
import Button from '@material-ui/core/Button'
import Layout from '../../../components/Layout'
import {
  useTemperatureDeviceTelemetry,
  useTemperatureDevice,
  useTemperatureDevices,
} from '../../../hooks/temperature'
import TimeSeriesChart, {
  TimeSeriesDataProp,
} from '../../../components/TimeSeriesChart'
import DeviceSelect from '../../../components/DeviceSelect'
import { Device } from '../../../models/iotcore'
import ReloadButton from '../../../components/ReloadButton'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    controls: {
      marginBottom: theme.spacing(3),
    },
    icon: {
      marginRight: theme.spacing(1),
    },
  })
)

const DeviceTemperaturePage: React.FC = () => {
  const classes = useStyles()
  const router = useRouter()
  const id = router.query.id as string
  const { data: device } = useTemperatureDevice(id)
  const {
    data: telemetry,
    refetch,
    isFetching,
  } = useTemperatureDeviceTelemetry(id)
  const { data: devices } = useTemperatureDevices()
  const title = `Temperature | ${device?.metadata.location}`
  const onSelectDevice = (device: Device) => {
    router.push(`/devices/${device.id}/temperature`)
  }
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
    <Layout title={title}>
      <div className={classes.controls}>
        <DeviceSelect devices={devices} onSelect={onSelectDevice} />
        <Button>
          <RoomIcon className={classes.icon} />
          {device?.metadata.location}
        </Button>
        <ReloadButton reload={refetch} loading={isFetching} />
      </div>

      {telemetry && (
        <>
          <Typography variant="subtitle1">Temperature</Typography>
          <TimeSeriesChart
            loading={!telemetry}
            unit="℃"
            telemetry={temperature}
          />
          <Typography variant="subtitle1">Humidity</Typography>
          <TimeSeriesChart loading={!telemetry} unit="%" telemetry={humidity} />
          <Typography variant="subtitle1">Brightness</Typography>
          <TimeSeriesChart
            loading={!telemetry}
            unit="Lux"
            telemetry={brightness}
          />
        </>
      )}
    </Layout>
  )
}

export default DeviceTemperaturePage
