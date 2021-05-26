import { createStyles, makeStyles, Theme } from '@material-ui/core'
import React from 'react'
import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress'
import { useTemperatureDevices } from '../hooks/temperature'
import TemperatureSummary from './TemperatureSummary'

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

const TemperatureSummaryList: React.FC = () => {
  const classes = useStyles()
  const { data: devices, isLoading } = useTemperatureDevices()

  if (isLoading) {
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
