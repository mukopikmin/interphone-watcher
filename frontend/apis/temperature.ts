import axios from 'axios'
import dayjs from 'dayjs'
import { TemperatureTelemetry } from '../models/temperature'

interface TemperatureTelemetryResponse {
  temperature: number
  humidity: number
  brightness: number
  timestamp: string
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
