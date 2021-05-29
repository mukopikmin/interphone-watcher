import React, { ChangeEvent } from 'react'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { DeviceConfig } from '@/models/iotcore'

interface Props {
  deviceId: string
  config: DeviceConfig
  updateConfig: (arg: DeviceConfig) => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    thresholdForm: {
      marginRight: theme.spacing(1),
    },
  })
)

const DeviceSettingForm: React.FC<Props> = (props: Props) => {
  const classes = useStyles()
  const onChangeInterphoneEnabled = () => {
    props.updateConfig({
      ...props.config,
      interphoneEnabled: !props.config.interphoneEnabled,
    })
  }
  const onChangeSoundVolume = (e: ChangeEvent<HTMLInputElement>) => {
    props.updateConfig({
      ...props.config,
      soundVolume: Number(e.target.value),
    })
  }
  const onChangeDetectOnce = () => {
    props.updateConfig({
      ...props.config,
      detectOnce: !props.config.detectOnce,
    })
  }

  return (
    <>
      <FormControlLabel
        control={
          <Switch
            checked={props.config.interphoneEnabled}
            onChange={onChangeInterphoneEnabled}
          />
        }
        label="Interphonse sensor"
      />
      <FormControlLabel
        control={
          <Switch
            checked={props.config.detectOnce}
            onChange={onChangeDetectOnce}
          />
        }
        label="Disable after detection"
      />
      <TextField
        variant="outlined"
        type="number"
        value={props.config.soundVolume}
        onChange={onChangeSoundVolume}
        size="small"
        label="Sound volume"
        className={classes.thresholdForm}
      />
    </>
  )
}

export default DeviceSettingForm
