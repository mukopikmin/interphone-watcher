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
  volume: number
  pattern: {
    high: number
    low: number
  }
}

interface TelemetryDoc {
  volume: number
  pattern: {
    high: number
    low: number
  }
  timestamp: Date
}

export const storeInterphoneTelemetry = async (event: Event, _: Context) => {
  const firestore = new Firestore()
  const message = Buffer.from(event.data, 'base64').toString()
  const telemetry: Telemetry = JSON.parse(message)
  const doc: TelemetryDoc = {
    volume: telemetry.volume,
    pattern: telemetry.pattern,
    timestamp: dayjs().toDate(),
  }

  await firestore
    .collection('versions')
    .doc('2')
    .collection('devices')
    .doc(telemetry.deviceId)
    .collection('interphone')
    .add(doc)
}
