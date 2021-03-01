import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { getDeviceConfigVersions } from '../../apis'
import ConfigVersionList from '../../components/ConfigVersionList'
import CurrentConfig from '../../components/CurrentConfig'
import DeviceSetting from '../../components/DeviceSetting'
import Layout from '../../components/Layout'
import { DeviceConfigVersion } from '../../interfaces'

const DevicePage = () => {
  const router = useRouter()
  const id = router.query.id as string
  const query = useQuery<DeviceConfigVersion[]>(['configVersions', id], () =>
    getDeviceConfigVersions(id)
  )
  const config =
    query.data && query.data.length > 0 ? query.data[0].config : null

  if (!id || !config) {
    return <></>
  }

  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <h1>{id}</h1>
      <CurrentConfig config={config} />
      <DeviceSetting deviceId={id} config={config} />
      <ConfigVersionList deviceId={id} />
    </Layout>
  )
}

export default DevicePage
