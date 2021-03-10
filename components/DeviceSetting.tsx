import { ChangeEvent, useEffect, useState } from 'react'
import {
  useDeviceConfigVersionsQuery,
  useDeviceUpdateMutation,
} from '../hooks/device'
import { DeviceConfig } from '../interfaces'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'

interface DeviceSettingProps {
  deviceId: string
  config: DeviceConfig
}

const DeviceSetting = (props: DeviceSettingProps) => {
  const [sensorEnabled, setSensorEnabled] = useState(props.config.sensorEnabled)
  const [threshold, setThreshold] = useState(props.config.threshold)
  const onChangeSensorEnabled = () => {
    setSensorEnabled(!sensorEnabled)
  }
  const onChangeThrehold = (e: ChangeEvent<HTMLInputElement>) => {
    setThreshold(Number(e.target.value))
  }
  const query = useDeviceConfigVersionsQuery(props.deviceId)
  const mutateDevice = useDeviceUpdateMutation(props.deviceId)
  const submit = () => {
    mutateDevice.mutate(
      {
        sensorEnabled,
        threshold,
      },
      {
        onSuccess: () => {
          query.refetch()
        },
      }
    )
  }

  useEffect(() => {
    setSensorEnabled(props.config.sensorEnabled)
    setThreshold(props.config.threshold)
  }, [props.config])

  return (
    <>
      <FormControlLabel
        control={
          <Switch checked={sensorEnabled} onChange={onChangeSensorEnabled} />
        }
        label="Sensor enabled"
      />
      <FormControlLabel
        control={
          <Switch checked={sensorEnabled} onChange={onChangeSensorEnabled} />
        }
        label="Disable after fire"
      />
      <TextField
        variant="outlined"
        type="number"
        value={threshold}
        onChange={onChangeThrehold}
        size="small"
      />
      <Button color="primary" variant="contained" onClick={submit}>
        update
      </Button>
    </>
  )
}

export default DeviceSetting
