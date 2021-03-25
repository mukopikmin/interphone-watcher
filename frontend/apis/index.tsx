import { Device, DeviceConfig } from '../interfaces'
import axios from 'axios'
import dayjs from 'dayjs'

interface DeviceConfigVersionsResponse {
  version: number
  cloudUpdateTime: string | null
  deviceAckTime: string | null
  config: DeviceConfig | null
}

export const getDeviceConfigVersions = async (deviceId: string) => {
  const path = `/api/devices/${deviceId}`
  const { data } = await axios.get<DeviceConfigVersionsResponse[]>(path)

  return data.map((d) => ({
    ...d,
    cloudUpdateTime: d.cloudUpdateTime ? dayjs(d.cloudUpdateTime) : null,
    deviceAckTime: d.deviceAckTime ? dayjs(d.deviceAckTime) : null,
  }))
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
