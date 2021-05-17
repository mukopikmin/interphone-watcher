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
}

interface TelemetryDoc {
  temperature: number
  humidity: number
  timestamp: Date
}

export const storeTemperatureTelemetry = async (
  event: Event,
  _context: Context
) => {
  const firestore = new Firestore()
  const message = Buffer.from(event.data, 'base64').toString()
  const now = dayjs()
  const telemetry: Telemetry = JSON.parse(message)
  const doc: TelemetryDoc = {
    temperature: telemetry.temperature,
    humidity: telemetry.humidity,
    timestamp: now.toDate(),
  }
  const { subFolder } = event.attributes

  console.log(subFolder)

  switch (subFolder) {
    case 'temperature':
      await firestore
        .collection('versions')
        .doc('1')
        .collection('devices')
        .doc(telemetry.deviceId)
        .collection('temperature')
        .add(doc)
  }
}
