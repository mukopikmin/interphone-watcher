import { Device, DeviceConfig, DeviceConfigVersion } from '../interfaces'
import axios from 'axios'

export const getDeviceConfigVersions = async (deviceId: string) => {
  const path = `/api/devices/${deviceId}`
  const { data } = await axios.get<DeviceConfigVersion[]>(path)

  return data
}

export const updateConfig = async (id: string, config: DeviceConfig) => {
  const path = `/api/devices/${id}`
  const res = await axios.post(path, config)

  return res
}

export const getDevices = async () => {
  const { data } = await axios.get<Device[]>('/api/devices')

  return data
}
