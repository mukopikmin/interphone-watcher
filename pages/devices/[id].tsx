import { useRouter } from 'next/router'
import ConfigVersionList from '../../components/ConfigVersionList'
import DeviceSetting from '../../components/DeviceSetting'
import Layout from '../../components/Layout'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import {
  useDeviceConfigQuery,
  useDeviceConfigVersionsQuery,
  useDevicesQuery,
} from '../../hooks/device'
import { DeviceConfig } from '../../interfaces'
import DeviceSelect from '../../components/DeviceSelect'
import ReloadButton from '../../components/ReloadButton'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    configs: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
    },
    actions: {
      marginBottom: theme.spacing(3),
    },
    deviceSelector: {
      marginRight: theme.spacing(1),
    },
  })
)

const DevicePage = () => {
  const classes = useStyles()
  const router = useRouter()
  const { data, refetch: refetchDevices } = useDevicesQuery()
  const devices = data || []
  const id = router.query.id as string
  const {
    data: configVersions,
    isLoading,
    isError,
    error,
    refetch: refetchDeviceConfigVersion,
  } = useDeviceConfigVersionsQuery(id)
  const initialConfig: DeviceConfig = {
    sensorEnabled: false,
    threshold: 100,
    actOnce: true,
  }
  const config = useDeviceConfigQuery(id) || initialConfig
  const refetch = async () => {
    await refetchDevices()
    await refetchDeviceConfigVersion()
  }

  if (isError) {
    return (
      <Layout title={`Interphone Watcher | ${id}`}>
        <h1>{id}</h1>
        <p>{error?.message}</p>
      </Layout>
    )
  }

  return (
    <Layout title={`Interphone Watcher | ${id}`}>
      <div className={classes.actions}>
        <span className={classes.deviceSelector}>
          <DeviceSelect devices={devices} />
        </span>
        <ReloadButton reload={refetch} />
      </div>

      <DeviceSetting deviceId={id} config={config || initialConfig} />

      <div className={classes.configs}>
        <ConfigVersionList
          configVersions={configVersions}
          isLoading={isLoading}
        />
      </div>
    </Layout>
  )
}

export default DevicePage
