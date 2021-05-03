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

// async function quickstart() {
//   const firestore = new Firestore()
//   const telemetry: Telemetry = {
//     temperature: 1,
//     humidity: 2,
//     timestamp: new Date(),
//   }
//   const db = await firestore
//     .collection('devices')
//     .doc('test2')
//     .collection('telemetry')
//     .add(telemetry)
// }
// quickstart()

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
    .collection('devices')
    .doc(telemetry.deviceId)
    .collection('telemetry')
    .add(doc)
}
