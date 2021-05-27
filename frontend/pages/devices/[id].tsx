import { useRouter } from 'next/router'
import Typography from '@material-ui/core/Typography'
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import { useEffect, useState } from 'react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Layout from '@/components/Layout'
import { useTemperatureDeviceTelemetry } from '@/hooks/temperature'
import TimeSeriesChart, {
  TimeSeriesDataProp,
} from '@/components/TimeSeriesChart'
import DeviceSelect from '@/components/DeviceSelect'
import { Device } from '@/models/iotcore'
import ReloadButton from '@/components/ReloadButton'
import DeviceSetting from '@/components/DeviceSetting'
import {
  useDeviceQuery,
  useDeviceConfigVersionsQuery,
  useDevicesQuery,
} from '@/hooks/iotcore'
import TabPanel from '@/components/TabPanel'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    controls: {
      marginBottom: theme.spacing(3),
    },
    tabpanel: {
      marginTop: theme.spacing(2),
    },
  })
)

const DeviceTemperaturePage: React.FC = () => {
  const classes = useStyles()
  const router = useRouter()
  const id = router.query.id as string
  const { data: device } = useDeviceQuery(id)
  const {
    data: telemetry,
    refetch: refetchTelemetry,
    isFetching: isFetchingTelemetry,
  } = useTemperatureDeviceTelemetry(id)
  const { data: devices } = useDevicesQuery()
  const title = `Temperature | ${device?.metadata.location}`
  const onSelectDevice = (device: Device) => {
    router.push(`/devices/${device.id}`)
  }
  const [temperature, setTemperature] = useState<TimeSeriesDataProp[]>([])
  const [humidity, setHumidity] = useState<TimeSeriesDataProp[]>([])
  const [brightness, setBrightness] = useState<TimeSeriesDataProp[]>([])
  const {
    isFetching: isFetchingConfigVersions,
    refetch: refetchConfigVersions,
  } = useDeviceConfigVersionsQuery(id)
  const [tab, setTab] = useState(0)
  const handleTabChange = (_: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue)
  }
  const reload = () => {
    switch (tab) {
      case 0:
        refetchTelemetry()
        break
      case 1:
        refetchConfigVersions()
        break
    }
  }

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
        <ReloadButton
          reload={reload}
          loading={isFetchingTelemetry || isFetchingConfigVersions}
        />
      </div>

      <Tabs
        value={tab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        scrollButtons="auto"
        variant="scrollable"
      >
        <Tab label="Telemetry charts" />
        <Tab label="Device settings" />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <div className={classes.tabpanel}>
          <Typography variant="subtitle1">Temperature</Typography>
          <TimeSeriesChart
            name="Temperature"
            loading={!telemetry}
            unit="℃"
            telemetry={temperature}
          />
          <Typography variant="subtitle1">Humidity</Typography>
          <TimeSeriesChart
            name="Humidity"
            loading={!telemetry}
            unit="%"
            telemetry={humidity}
          />
          <Typography variant="subtitle1">Brightness</Typography>
          <TimeSeriesChart
            name="Brightness"
            loading={!telemetry}
            unit="Lux"
            telemetry={brightness}
          />
        </div>
      </TabPanel>

      <TabPanel value={tab} index={1}>
        <div className={classes.tabpanel}>
          <DeviceSetting deviceId={id} />
        </div>
      </TabPanel>
    </Layout>
  )
}

export default DeviceTemperaturePage
