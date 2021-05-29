import { createStyles, makeStyles, Theme } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import RotateLeftIcon from '@material-ui/icons/RotateLeft'
import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import { useDeviceUpdateMutation } from '@/hooks/iotcore'
import { initialDeviceConfig } from '@/models/iotcore'

interface Props {
  deviceId: string
  loading: boolean
  refetch: () => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    icon: {
      marginRight: theme.spacing(1),
    },
    wrapper: {
      margin: theme.spacing(1),
      position: 'relative',
    },
    buttonProgress: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
  })
)

const ResetButton: React.FC<Props> = (props: Props) => {
  const classes = useStyles()
  const { loading, deviceId, refetch } = props
  const mutateDevice = useDeviceUpdateMutation(deviceId)
  const reset = () => {
    mutateDevice.mutate(initialDeviceConfig, {
      onSuccess: () => refetch(),
    })
  }

  return (
    <span className={classes.wrapper}>
      <Button onClick={reset} disabled={loading}>
        <RotateLeftIcon className={classes.icon} /> Reset default
      </Button>
      {loading && (
        <CircularProgress size={24} className={classes.buttonProgress} />
      )}
    </span>
  )
}

export default ResetButton
