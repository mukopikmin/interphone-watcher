import { Timestamp } from '@google-cloud/firestore'
import dayjs from 'dayjs'

export interface TemperatureTelemetry {
  humidity: number
  temperature: number
  brightness: number
  timestamp: dayjs.Dayjs
}

export interface TemperatureRawTelemetry {
  humidity: number
  temperature: number
  brightness: number
  timestamp: Timestamp
}
