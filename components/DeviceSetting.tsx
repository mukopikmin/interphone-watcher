import { ChangeEvent, useEffect, useState } from 'react'
import {
  useDeviceConfigVersionsQuery,
  useDeviceUpdateMutation,
} from '../hooks/device'
import { DeviceConfig } from '../interfaces'

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
  }, [])

  return (
    <>
      <input
        type="checkbox"
        checked={sensorEnabled}
        onChange={onChangeSensorEnabled}
      />
      <input type="number" value={threshold} onChange={onChangeThrehold} />
      <button onClick={submit}>update</button>
    </>
  )
}

export default DeviceSetting
