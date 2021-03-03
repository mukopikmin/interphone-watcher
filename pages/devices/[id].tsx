import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { getDeviceConfigVersions } from '../../apis'
import ConfigVersionList from '../../components/ConfigVersionList'
import CurrentConfig from '../../components/CurrentConfig'
import DeviceSetting from '../../components/DeviceSetting'
import Layout from '../../components/Layout'
import { DeviceConfig } from '../../functions/src/schema'
import { DeviceConfigVersion } from '../../interfaces'

const DevicePage = () => {
  const router = useRouter()
  const id = router.query.id as string
  const query = useQuery<DeviceConfigVersion[]>(['configVersions', id], () =>
    getDeviceConfigVersions(id)
  )
  const config =
    query.data && query.data.length > 0 ? query.data[0].config : null

  if (!id) {
    return <p>No device found.</p>
  }

  if (!config) {
    const initialConfig: DeviceConfig = {
      sensorEnabled: false,
      threshold: 100,
    }

    return (
      <>
        <h1>{id}</h1>
        <DeviceSetting deviceId={id} config={initialConfig} />
        <p>No settings found.</p>
      </>
    )
  }

  return (
    <Layout title={`Interphone Watcher | ${id}`}>
      <h1>{id}</h1>
      <CurrentConfig config={config} />
      <DeviceSetting deviceId={id} config={config} />
      <ConfigVersionList deviceId={id} />
    </Layout>
  )
}

export default DevicePage
