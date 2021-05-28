import { createStyles, makeStyles, Theme } from '@material-ui/core'
import Layout from '@/components/Layout'
import TemperatureSummaryList from '@/components/TemperatureSummaryList'
import { useDevicesQuery } from '@/hooks/iotcore'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    section: {
      marginBottom: theme.spacing(3),
    },
  })
)

const IndexPage: React.FC = () => {
  const classes = useStyles()
  const { data: devices, isLoading } = useDevicesQuery()

  return (
    <Layout title="Interphone Watcher">
      <div className={classes.section}>
        <TemperatureSummaryList devices={devices} loading={isLoading} />
      </div>
    </Layout>
  )
}

export default IndexPage
