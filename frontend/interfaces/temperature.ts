import { Timestamp } from '@google-cloud/firestore'
import dayjs from 'dayjs'

export interface TemperatureDevice {
  id: string
  telemetry: TemperatureTelemetry | null
}

export interface TemperatureTelemetry {
  humidity: number
  temperature: number
  timestamp: dayjs.Dayjs
}

export interface TemperatureRawTelemetry {
  humidity: number
  temperature: number
  timestamp: Timestamp
}
