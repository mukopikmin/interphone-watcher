import { Firestore } from '@google-cloud/firestore'
import { NextApiRequest, NextApiResponse } from 'next'
import { v1 as iotCore } from '@google-cloud/iot'
import dayjs from 'dayjs'
import {
  TemperatureDevice,
  TemperatureDeviceMetadata,
  TemperatureRawTelemetry,
  TemperatureTelemetry,
} from '../../../../interfaces/temperature'

const region = process.env.REGION || ''
const projectId = process.env.GCP_PROJECT || ''
const registryId = process.env.TEMPERATURE_REGISTRY_ID || ''
const firestore = new Firestore()

const handler = async (
  _req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const iot = new iotCore.DeviceManagerClient()
  const registryPath = iot.registryPath(projectId, region, registryId)
  const [iotDevices] = await iot.listDevices({
    parent: registryPath,
    fieldMask: { paths: ['metadata', 'config'] },
  })

  const devices: TemperatureDevice[] = await Promise.all(
    iotDevices.map(async (device) => {
      const deviceId = device.id as string
      const snapshot = await firestore
        .collection(`versions/1/devices/${deviceId}/temperature`)
        .orderBy('timestamp')
        .startAt(dayjs().add(-1, 'hours').toDate())
        .get()
      const docs: TemperatureTelemetry[] = snapshot.docs.map((doc) => {
        const data = doc.data() as TemperatureRawTelemetry
        const timestamp = dayjs(data.timestamp.toDate())

        return {
          ...data,
          timestamp,
        }
      })
      const telemetry = docs.length > 0 ? docs[docs.length - 1] : null
      const metadata = device.metadata as TemperatureDeviceMetadata

      return {
        id: deviceId,
        location: metadata?.location,
        telemetry,
      }
    })
  )

  res.setHeader('Content-Type', 'applciation/json')
  res.status(200).json(devices)
}

export default handler
