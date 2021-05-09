import { createStyles, makeStyles } from '@material-ui/core'
import React from 'react'
import Grid from '@material-ui/core/Grid'
import { useTemperatureDevices } from '../hooks/temperature'
import TemperatureSummary from './TemperatureSummary'

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },
  })
)

const TemperatureSummaryList: React.FC = () => {
  const classes = useStyles()
  const { data: devices } = useTemperatureDevices()

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
