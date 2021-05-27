import axios from 'axios'
import dayjs from 'dayjs'
import { Device, DeviceConfig, DeviceConfigVersion } from '../models/iotcore'

interface DeviceConfigVersionsResponse {
  version: number
  cloudUpdateTime: string | null
  deviceAckTime: string | null
  config: DeviceConfig | null
}

export const getDevices = async (): Promise<Device[]> => {
  const path = `/api/devices`
  const { data: devices } = await axios.get<Device[]>(path)

  return devices
}

export const getDevice = async (id: string): Promise<Device> => {
  const path = `/api/devices/${id}`
  const { data: device } = await axios.get<Device>(path)

  return device as Device
}

export const getDeviceConfigVersions = async (
  deviceId: string
): Promise<DeviceConfigVersion[]> => {
  const path = `/api/devices/${deviceId}/config/versions`
  const { data } = await axios.get<DeviceConfigVersionsResponse[]>(path)

  return data.map((d) => ({
    ...d,
    cloudUpdateTime: d.cloudUpdateTime ? dayjs(d.cloudUpdateTime) : null,
    deviceAckTime: d.deviceAckTime ? dayjs(d.deviceAckTime) : null,
  }))
}

export const updateConfig = async (
  id: string,
  config: DeviceConfig
): Promise<void> => {
  const path = `/api/devices/${id}/config`

  await axios.post(path, config)
}

// export const getDevices = async (): Promise<Device[]> => {
//   const { data } = await axios.get<Device[]>('/api/interphone/devices')

//   return data
// }
