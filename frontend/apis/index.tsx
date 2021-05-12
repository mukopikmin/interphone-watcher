import axios from 'axios'
import dayjs from 'dayjs'
import {
  InterphoneDevice,
  InterphoneDeviceConfig,
  InterphoneDeviceConfigVersion,
} from '../models/interphone'

interface DeviceConfigVersionsResponse {
  version: number
  cloudUpdateTime: string | null
  deviceAckTime: string | null
  config: InterphoneDeviceConfig | null
}

export const getDeviceConfigVersions = async (
  deviceId: string
): Promise<InterphoneDeviceConfigVersion[]> => {
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
  config: InterphoneDeviceConfig
): Promise<void> => {
  const path = `/api/devices/${id}`

  await axios.post(path, config)
}

export const getDevices = async (): Promise<InterphoneDevice[]> => {
  const { data } = await axios.get<InterphoneDevice[]>('/api/devices')

  return data
}
