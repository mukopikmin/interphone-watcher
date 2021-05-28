import { useRouter } from 'next/router'
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import { useState } from 'react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Layout from '@/components/Layout'
import { useTemperatureDeviceTelemetry } from '@/hooks/firestore'
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
import ChartList from '@/components/ChartList'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    controls: {
      marginBottom: theme.spacing(3),
    },
    tabpanel: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(3),
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
    isLoading: isLoadingTelemetry,
  } = useTemperatureDeviceTelemetry(id)
  const { data: devices } = useDevicesQuery()
  const title = `${device?.metadata.location || 'Unknown'}`
  const onSelectDevice = (device: Device) => {
    router.push(`/devices/${device.id}`)
  }
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
          <ChartList telemetry={telemetry} loading={isLoadingTelemetry} />
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
