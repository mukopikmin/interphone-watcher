import axios from 'axios'
import dayjs from 'dayjs'
import { TemperatureDevice } from '../interfaces/temperature'

interface TemperatureDeviceResponse {
  id: string
  telemetry: {
    temperature: number
    humidity: number
    timestamp: string
  } | null
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
