import { Timestamp } from '@google-cloud/firestore'
import dayjs from 'dayjs'
import { Device } from './iotcore'

export interface TemperatureDevice extends Device {
  metadata: TemperatureDeviceMetadata
}

export interface TemperatureDeviceMetadata {
  location?: string
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
