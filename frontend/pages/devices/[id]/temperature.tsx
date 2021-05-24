import { useRouter } from 'next/router'
import Typography from '@material-ui/core/Typography'
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import { useEffect, useState } from 'react'
import RoomIcon from '@material-ui/icons/Room'
import Button from '@material-ui/core/Button'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
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
import ConfigVersionList from '../../../components/ConfigVersionList'
import { useDeviceConfigVersionsQuery } from '../../../hooks/interphone'
import TabPanel from '../../../components/TabPanel'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    controls: {
      marginBottom: theme.spacing(3),
    },
    icon: {
      marginRight: theme.spacing(1),
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
  const {
    data: configVersions,
    refetch: refetchConfigVersions,
  } = useDeviceConfigVersionsQuery(id)
  const [tab, setTab] = useState(0)
  const handleTabChange = (_: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue)
  }
  const reload = () => {
    switch (tab) {
      case 0:
        refetch()
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
        <Button>
          <RoomIcon className={classes.icon} />
          {device?.metadata.location}
        </Button>
        <ReloadButton reload={reload} loading={isFetching} />
      </div>

      <Tabs
        value={tab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab label="Telemetry charts" />
        <Tab label="Device settings" />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <div className={classes.tabpanel}>
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
        </div>
      </TabPanel>

      <TabPanel value={tab} index={1}>
        <div className={classes.tabpanel}>
          <ConfigVersionList
            configVersions={configVersions}
            isLoading={isFetching}
          />
        </div>
      </TabPanel>
    </Layout>
  )
}

export default DeviceTemperaturePage
