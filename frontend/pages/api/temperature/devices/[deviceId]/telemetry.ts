import { Firestore, Timestamp } from '@google-cloud/firestore'
import { NextApiRequest, NextApiResponse } from 'next'
import dayjs from 'dayjs'

interface Telemetry {
  humidity: number
  temperature: number
  timestamp: Timestamp
}

interface QueryParams {
  [key: string]: string
}

const firestore = new Firestore()
const DEFAULT_DATA_RANGE_HOURS = 12

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { deviceId, start, end } = req.query as QueryParams
  const startAt = dayjs(start || '')
  const endAt = dayjs(end || '')
  let query = firestore
    .collection(`versions/1/devices/${deviceId}/temperature`)
    .orderBy('timestamp')

  if (startAt.isValid() && endAt.isValid()) {
    query = query.startAt(startAt.toDate()).endAt(endAt.toDate())
  } else {
    query = query.startAt(
      dayjs().add(-DEFAULT_DATA_RANGE_HOURS, 'hours').toDate()
    )
  }

  const snapshot = await query.get()
  const docs = snapshot.docs.map((doc) => {
    const data = doc.data() as Telemetry
    const timestamp = dayjs(data.timestamp.toDate()).format()

    return {
      ...data,
      timestamp,
    }
  })

  res.setHeader('Content-Type', 'applciation/json')
  res.status(200).json(docs)
}

export default handler
