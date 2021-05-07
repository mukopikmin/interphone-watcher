import Layout from '../components/Layout'
import InterphoneSummary from '../components/InterphoneSummary'
import TemperatureSummaryList from '../components/TemperatureSummaryList'
import { useDevicesConfigVersionsQuery, useDevicesQuery } from '../hooks/device'
import { createStyles, makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      marginBottom: theme.spacing(2),
    },
  })
)

const IndexPage = () => {
  const classes = useStyles()
  const { data: devices } = useDevicesQuery()
  const { data: devicesConfigVersions } = useDevicesConfigVersionsQuery(
    devices?.map((device) => device.id)
  )
  const configs = devicesConfigVersions
    ?.map((versions) => versions[0] && versions[0].config)
    .filter((config) => config !== null)

  return (
    <Layout title="Interphone Watcher">
      <div className={classes.card}>
        <InterphoneSummary devices={devices} configs={configs} />
      </div>
      <div className={classes.card}>
        <TemperatureSummaryList />
      </div>
    </Layout>
  )
}

export default IndexPage
