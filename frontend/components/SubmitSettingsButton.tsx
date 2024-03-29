import { createStyles, makeStyles, Theme } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import PublishIcon from '@material-ui/icons/Publish'
import React from 'react'
import { useDeviceUpdateMutation } from '@/hooks/iotcore'
import { DeviceConfig } from '@/models/iotcore'

interface Props {
  deviceId: string
  config: DeviceConfig
  refresh: () => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    icon: {
      marginRight: theme.spacing(1),
    },
  })
)

const SubmitSettingsButton: React.FC<Props> = (props: Props) => {
  const classes = useStyles()
  const mutateDevice = useDeviceUpdateMutation(props.deviceId)
  const submit = () =>
    mutateDevice.mutate(props.config, {
      onSuccess: () => props.refresh(),
    })

  return (
    <Button onClick={submit}>
      <PublishIcon className={classes.icon} /> Update
    </Button>
  )
}

export default SubmitSettingsButton
