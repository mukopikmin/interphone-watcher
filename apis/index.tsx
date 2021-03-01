import { DeviceConfig, DeviceConfigVersion } from '../interfaces'

export const getDeviceConfigVersions = async (deviceId: string) => {
  const res = await fetch(`/api/devices/${deviceId}/config`)
  const configVersions: DeviceConfigVersion[] = await res.json()

  return configVersions
}

export const updateConfig = async (config: DeviceConfig) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(config),
  }
  const res = await fetch(`/api/config/update`, options)
  const updatedConfig = await res.json()

  return updatedConfig
}

export const getDevices = async () => {
  const res = await fetch('/api/devices')
  const devices = await res.json()

  return devices
}