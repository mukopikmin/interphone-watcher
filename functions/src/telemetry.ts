import { Storage } from '@google-cloud/storage'
import * as dayjs from 'dayjs'
import { Context, Message } from './schema'

const bucketName = process.env.INTERPHONE_TELEMETRY_BUCKET

export const storeInterphoneTelemetry = async (
  message: Message,
  context: Context
) => {
  if (!bucketName) {
    throw Error('No bucket is specified')
  }

  const raw = Buffer.from(message.data, 'base64').toString()
  const data = JSON.parse(raw)
  const storage = new Storage()
  const now = dayjs()
  const bucket = storage.bucket(bucketName)
  const file = bucket.file(`${now.format()}.json`)

  await file.save(JSON.stringify(data))
}
