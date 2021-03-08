import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { getDeviceConfigVersions } from '../../apis'
import ConfigVersionList from '../../components/ConfigVersionList'
import DeviceSetting from '../../components/DeviceSetting'
import Layout from '../../components/Layout'
import { DeviceConfig } from '../../functions/src/schema'
import { DeviceConfigVersion } from '../../interfaces'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

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
  const query = useQuery<DeviceConfigVersion[]>(
    ['configVersions', id],
    () => getDeviceConfigVersions(id),
    { enabled: id !== undefined }
  )
  const config =
    query.data && query.data.length > 0 ? query.data[0].config : null

  if (!id) {
    return (
      <Layout title={`Interphone Watcher | ${id}`}>
        <p>No device found.</p>
      </Layout>
    )
  }

  if (!config) {
    const initialConfig: DeviceConfig = {
      sensorEnabled: false,
      threshold: 100,
    }

    return (
      <Layout title={`Interphone Watcher | ${id}`}>
        <h1>{id}</h1>
        <DeviceSetting deviceId={id} config={initialConfig} />
        <p>No settings found.</p>
      </Layout>
    )
  }

  return (
    <Layout title={`Interphone Watcher | ${id}`}>
      <h1>{id}</h1>
      <DeviceSetting deviceId={id} config={config} />
      <div className={classes.configs}>
        <ConfigVersionList deviceId={id} />
      </div>
    </Layout>
  )
}

export default DevicePage
