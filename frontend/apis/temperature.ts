import axios from 'axios'
import dayjs from 'dayjs'
import { TemperatureDevice, TemperatureTelemetry } from '../models/temperature'

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

export const getTemperatureDevices = async (): Promise<TemperatureDevice[]> => {
  const path = `/api/temperature/devices`
  const { data: devices } = await axios.get<TemperatureDevice[]>(path)

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

export const getTemperatureDevice = async (
  id: string
): Promise<TemperatureDevice> => {
  const path = `/api/temperature/devices/${id}`
  const { data: device } = await axios.get<TemperatureDevice>(path)

  return device as TemperatureDevice
}

export const getDeviceTemperatureTelemetry = async (
  id: string
): Promise<TemperatureTelemetry[]> => {
  const path = `/api/temperature/devices/${id}/telemetry`
  const { data: telemetry } = await axios.get<TemperatureTelemetryResponse[]>(
    path
  )

  return telemetry.map((t) => ({
    ...t,
    timestamp: dayjs(t.timestamp),
  }))
}
