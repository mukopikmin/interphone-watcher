import { Firestore, Timestamp } from '@google-cloud/firestore'
import { NextApiRequest, NextApiResponse } from 'next'
import dayjs from 'dayjs'

interface Telemetry {
  humidity: number
  temperature: number
  timestamp: Timestamp
}

const firestore = new Firestore()
const DATA_RANGE_HOURS = 12

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { deviceId, start, end } = req.query as { [key: string]: string }
  const startAt = dayjs(start)
  const endAt = dayjs(end)
  const collection = firestore.collection(`devices/${deviceId}/telemetry`)
  let query = collection.orderBy('timestamp')

  if (startAt.isValid() && endAt.isValid()) {
    query = query.startAt(startAt.toDate()).endAt(endAt.toDate())
  } else {
    query = query.startAt(dayjs().add(-DATA_RANGE_HOURS, 'hours').toDate())
  }

  const snapshot = await query.get()
  const docs = snapshot.docs.map((doc) => {
    const data = doc.data() as Telemetry

    return {
      ...data,
      timestamp: dayjs(data.timestamp.toDate()).format(),
    }
  })

  res.setHeader('Content-Type', 'applciation/json')
  res.status(200).json(docs)
}

export default handler
