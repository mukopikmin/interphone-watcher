import { Firestore } from '@google-cloud/firestore'
import * as dayjs from 'dayjs'

interface Message {
  data: string
}

interface Context {}

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
  message: Message,
  _context: Context
) => {
  const firestore = new Firestore()
  const raw = Buffer.from(message.data, 'base64').toString()
  const now = dayjs()
  const telemetry: Telemetry = JSON.parse(raw)
  const doc: TelemetryDoc = {
    temperature: telemetry.temperature,
    humidity: telemetry.humidity,
    timestamp: now.toDate(),
  }

  await firestore
    .collection('versions')
    .doc('1')
    .collection('devices')
    .doc(telemetry.deviceId)
    .collection('temperature')
    .add(doc)
}
