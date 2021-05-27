import axios from 'axios'
import dayjs from 'dayjs'
import { Device } from '../models/iotcore'
import { TemperatureTelemetry } from '../models/temperature'

// interface TemperatureDeviceResponse {
//   id: string
//   location?: string
//   telemetry: TemperatureTelemetryResponse | null
// }

interface TemperatureTelemetryResponse {
  temperature: number
  humidity: number
  brightness: number
  timestamp: string
}

export const getDevices = async (): Promise<Device[]> => {
  const path = `/api/devices`
  const { data: devices } = await axios.get<Device[]>(path)

  return devices
  // return devices.map((device) => ({
  //   ...device,
  //   telemetry: device.telemetry
  //     ? {
  //         ...device.telemetry,
  //         timestamp: dayjs(device.telemetry.timestamp),
  //       }
  //     : null,
  // }))
}

export const getDevice = async (id: string): Promise<Device> => {
  const path = `/api/devices/${id}`
  const { data: device } = await axios.get<Device>(path)

  return device as Device
}

export const getDeviceTemperatureTelemetry = async (
  id: string
): Promise<TemperatureTelemetry[]> => {
  const path = `/api/devices/${id}/temperature`
  const { data: telemetry } = await axios.get<TemperatureTelemetryResponse[]>(
    path
  )

  return telemetry.map((t) => ({
    ...t,
    timestamp: dayjs(t.timestamp),
  }))
}
