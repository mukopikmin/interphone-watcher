import { Firestore } from '@google-cloud/firestore'
import * as dayjs from 'dayjs'

interface Event {
  attributes: {
    deviceId: string
    deviceNumId: string
    deviceRegistryId: string
    deviceRegistryLocation: string
    projectId: string
    subFolder: string
  }
  data: string
}

interface Context {
  eventId: string
  timestamp: string
  eventType: string
  resource: {
    service: string
    name: string
    type: string
  }
}

interface Telemetry {
  deviceId: string
  temperature: number
  humidity: number
  brightness: number
}

interface TelemetryDoc {
  temperature: number
  humidity: number
  timestamp: Date
  brightness: number
}

export const storeInterphoneTelemetry = async (event: Event, _: Context) => {
  const message = Buffer.from(event.data, 'base64').toString()

  console.log(message)
}
