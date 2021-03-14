import { createStyles, makeStyles, Theme } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import PublishIcon from '@material-ui/icons/Publish'
import { useDeviceUpdateMutation } from '../hooks/device'
import { DeviceConfig } from '../interfaces'

interface Props {
  deviceId: string
  config: DeviceConfig
  refresh: Function
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    icon: {
      marginRight: theme.spacing(1),
    },
  })
)

const SubmitSettingsButton = (props: Props) => {
  const classes = useStyles()
  const mutateDevice = useDeviceUpdateMutation(props.deviceId)
  const submit = () => {
    mutateDevice.mutate(props.config, {
      onSuccess: () => {
        props.refresh()
      },
    })
  }

  return (
    <Button onClick={submit}>
      <PublishIcon className={classes.icon} /> Update
    </Button>
  )
}

export default SubmitSettingsButton
