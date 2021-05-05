import { Firestore, Timestamp } from '@google-cloud/firestore'
import { NextApiRequest, NextApiResponse } from 'next'
import dayjs from 'dayjs'

interface Telemetry {
  humidity: number
  temperature: number
  timestamp: Timestamp
}

const firestore = new Firestore()

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  const collection = firestore.collection('devices/pizero1/telemetry')
  const snapshot = await collection.orderBy('timestamp').get()
  const docs = snapshot.docs.map((doc) => {
    const data = doc.data() as Telemetry

    return {
      ...data,
      timestamp: dayjs(data.timestamp.toDate()).format(),
    }
  })

  // snapshot.docs

  res.setHeader('Content-Type', 'applciation/json')
  res.status(200).json(docs)
}

export default handler
