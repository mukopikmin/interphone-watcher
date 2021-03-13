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
  const [config, setConfig] = useState(props.config)
  const onChangeSensorEnabled = () => {
    setConfig({ ...config, sensorEnabled: !config.sensorEnabled })
  }
  const onChangeThrehold = (e: ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, threshold: Number(e.target.value) })
  }
  const onChangeActOnce = () => {
    setConfig({ ...config, actOnce: !config.actOnce })
  }
  const query = useDeviceConfigVersionsQuery(props.deviceId)
  const mutateDevice = useDeviceUpdateMutation(props.deviceId)
  const submit = () => {
    mutateDevice.mutate(config, {
      onSuccess: () => {
        query.refetch()
      },
    })
  }

  useEffect(() => {
    setConfig({ ...config })
  }, [props.config])

  return (
    <>
      <FormControlLabel
        control={
          <Switch
            checked={config.sensorEnabled}
            onChange={onChangeSensorEnabled}
          />
        }
        label="Sensor enabled"
      />
      <FormControlLabel
        control={<Switch checked={config.actOnce} onChange={onChangeActOnce} />}
        label="Act once"
      />
      <TextField
        variant="outlined"
        type="number"
        value={config.threshold}
        onChange={onChangeThrehold}
        size="small"
        label="Threshold"
      />
      <Button color="primary" variant="contained" onClick={submit}>
        update
      </Button>
    </>
  )
}

export default DeviceSetting
