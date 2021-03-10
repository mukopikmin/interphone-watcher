import { useRouter } from 'next/router'
import ConfigVersionList from '../../components/ConfigVersionList'
import DeviceSetting from '../../components/DeviceSetting'
import Layout from '../../components/Layout'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import {
  useDeviceConfigQuery,
  useDeviceConfigVersionsQuery,
} from '../../hooks/device'
import { DeviceConfig } from '../../interfaces'

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    configs: {
      marginTop: 10,
      marginBottom: 10,
    },
  })
)

const DevicePage = () => {
  const classes = useStyles()
  const router = useRouter()
  const id = router.query.id as string
  const {
    data: configVersions,
    isLoading,
    isError,
    error,
  } = useDeviceConfigVersionsQuery(id)
  const initialConfig: DeviceConfig = {
    sensorEnabled: false,
    threshold: 100,
    actOnce: true,
  }
  const config = useDeviceConfigQuery(id) || initialConfig

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
      <h1>{id}</h1>
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
