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
import SubmitSettingsButton from '../../components/SubmitSettingsButton'
import { useEffect, useState } from 'react'

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

const initialConfig: DeviceConfig = {
  sensorEnabled: false,
  threshold: 100,
  actOnce: false,
}

const DevicePage = () => {
  const classes = useStyles()
  const router = useRouter()
  const { data: devices, refetch: refetchDevices } = useDevicesQuery()
  // const devices = data || []
  const id = router.query.id as string
  const {
    data: configVersions,
    isError,
    error,
    refetch: refetchConfigVersions,
    isFetching,
  } = useDeviceConfigVersionsQuery(id)
  const config = useDeviceConfigQuery(id) || initialConfig
  const [localConfig, setLocalConfig] = useState(config)
  const refetch = async () => {
    await refetchDevices()
    await refetchConfigVersions()
  }
  const updateConfig = (config: DeviceConfig) => {
    setLocalConfig(config)
  }

  useEffect(() => {
    if (config) {
      setLocalConfig(config)
    }
  }, [config])

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
        <SubmitSettingsButton
          deviceId={id}
          config={localConfig}
          refresh={refetch}
        />
      </div>

      <DeviceSetting
        deviceId={id}
        updateConfig={updateConfig}
        config={localConfig}
      />

      <div className={classes.configs}>
        <ConfigVersionList
          configVersions={configVersions}
          isLoading={isFetching}
        />
      </div>
    </Layout>
  )
}

export default DevicePage
