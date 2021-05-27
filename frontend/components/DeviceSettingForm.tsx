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
      maxWidth: 100,
      marginRight: theme.spacing(1),
    },
  })
)

const DeviceSettingForm: React.FC<Props> = (props: Props) => {
  const classes = useStyles()
  const onChangeSensorEnabled = () => {
    props.updateConfig({
      ...props.config,
      sensorEnabled: !props.config.sensorEnabled,
    })
  }
  const onChangeThrehold = (e: ChangeEvent<HTMLInputElement>) => {
    props.updateConfig({ ...props.config, threshold: Number(e.target.value) })
  }
  const onChangeActOnce = () => {
    props.updateConfig({ ...props.config, actOnce: !props.config.actOnce })
  }

  return (
    <>
      <FormControlLabel
        control={
          <Switch
            checked={props.config.sensorEnabled}
            onChange={onChangeSensorEnabled}
          />
        }
        label="Sensor enabled"
      />
      <FormControlLabel
        control={
          <Switch checked={props.config.actOnce} onChange={onChangeActOnce} />
        }
        label="Act once"
      />
      <TextField
        variant="outlined"
        type="number"
        value={props.config.threshold}
        onChange={onChangeThrehold}
        size="small"
        label="Threshold"
        className={classes.thresholdForm}
      />
    </>
  )
}

export default DeviceSettingForm
