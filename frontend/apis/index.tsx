import axios from 'axios'
import dayjs from 'dayjs'
import {
  Device,
  DeviceConfig,
  DeviceConfigVersion,
} from '../interfaces/interphone'

interface DeviceConfigVersionsResponse {
  version: number
  cloudUpdateTime: string | null
  deviceAckTime: string | null
  config: DeviceConfig | null
}

export const getDeviceConfigVersions = async (
  deviceId: string
): Promise<DeviceConfigVersion[]> => {
  const path = `/api/devices/${deviceId}`
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
  const path = `/api/devices/${id}`

  await axios.post(path, config)
}

export const getDevices = async (): Promise<Device[]> => {
  const { data } = await axios.get<Device[]>('/api/devices')

  return data
}
