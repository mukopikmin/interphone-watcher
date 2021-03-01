import Layout from '../components/Layout'
import DeviceList from '../components/DeviceList'

const IndexPage = () => {
  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <h1>Interphone Notification</h1>
      <DeviceList />
    </Layout>
  )
}

export default IndexPage
