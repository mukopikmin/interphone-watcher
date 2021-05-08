import axios from 'axios'
import dayjs from 'dayjs'
import {
  TemperatureDevice,
  TemperatureTelemetry,
} from '../interfaces/temperature'

interface TemperatureDeviceResponse {
  id: string
  telemetry: TemperatureTelemetryResponse | null
}

interface TemperatureTelemetryResponse {
  temperature: number
  humidity: number
  timestamp: string
}

export const getTemperatureDevices = async (): Promise<TemperatureDevice[]> => {
  const path = `/api/temperature/devices`
  const { data: devices } = await axios.get<TemperatureDeviceResponse[]>(path)

  return devices.map((device) => ({
    ...device,
    telemetry: device.telemetry
      ? {
          ...device.telemetry,
          timestamp: dayjs(device.telemetry.timestamp),
        }
      : null,
  }))
}

export const getDeviceTemperatureTelemetry = async (
  deviceId: string
): Promise<TemperatureTelemetry[]> => {
  const path = `/api/temperature/devices/${deviceId}/telemetry`
  const { data: telemetry } = await axios.get<TemperatureTelemetryResponse[]>(
    path
  )

  return telemetry.map((t) => ({
    ...t,
    timestamp: dayjs(t.timestamp),
  }))
}
