import { createStyles, makeStyles, Theme } from '@material-ui/core'
import React from 'react'
import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress'
import TemperatureSummary from '@/components/TemperatureSummary'
import { Device } from '@/models/iotcore'

interface Props {
  devices?: Device[]
  loading: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    loading: {
      textAlign: 'center',
      padding: theme.spacing(5),
    },
  })
)

const TemperatureSummaryList: React.FC<Props> = (props: Props) => {
  const classes = useStyles()
  const { loading, devices } = props

  if (loading) {
    return (
      <div className={classes.loading}>
        <CircularProgress />
      </div>
    )
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        {devices?.map((device) => (
          <Grid item xs={12} sm={6} key={device.id}>
            <TemperatureSummary key={device.id} device={device} />
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

export default TemperatureSummaryList
