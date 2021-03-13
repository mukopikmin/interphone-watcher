import Layout from '../components/Layout'
import InterphoneSummary from '../components/InterphoneSummary'
import { useDevicesConfigVersionsQuery, useDevicesQuery } from '../hooks/device'

const IndexPage = () => {
  const { data: devices } = useDevicesQuery()
  const { data: devicesConfigVersions } = useDevicesConfigVersionsQuery(
    devices?.map((device) => device.id)
  )
  const configs = devicesConfigVersions
    ?.map((versions) => versions[0] && versions[0].config)
    .filter((config) => config !== null)

  return (
    <Layout title="Interphone Watcher">
      <InterphoneSummary devices={devices} configs={configs} />
    </Layout>
  )
}

export default IndexPage
