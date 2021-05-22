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

export const storeTemperatureTelemetry = async (event: Event, _: Context) => {
  const firestore = new Firestore()
  const message = Buffer.from(event.data, 'base64').toString()
  const now = dayjs()
  const telemetry: Telemetry = JSON.parse(message)
  const doc: TelemetryDoc = {
    temperature: telemetry.temperature,
    humidity: telemetry.humidity,
    brightness: telemetry.brightness,
    timestamp: now.toDate(),
  }

  await firestore
    .collection('versions')
    .doc('2')
    .collection('devices')
    .doc(telemetry.deviceId)
    .collection('temperature')
    .add(doc)
}
