import { NextApiRequest, NextApiResponse } from 'next'
import { v1 as iotCore } from '@google-cloud/iot'
import {
  TemperatureDevice,
} from '../../../../../interfaces/temperature'

const region = process.env.REGION || ''
const projectId = process.env.GCP_PROJECT || ''
const registryId = process.env.TEMPERATURE_REGISTRY_ID || ''

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const deviceId = req.query.deviceId.toString()
  const iot = new iotCore.DeviceManagerClient()
  const devicePath = iot.devicePath(projectId, region, registryId, deviceId)
  const [iotDevice] = await iot.getDevice({
    name: devicePath,
    fieldMask: { paths: ['metadata', 'config'] },
  })
  // const metadata = iotDevice.metadata as TemperatureDeviceMetadata
  // const device: TemperatureDevice = {
  //   id: deviceId,
  //   location: metadata.location,
  //   telemetry: null,
  // }

  res.setHeader('Content-Type', 'applciation/json')
  res.status(200).json(iotDevice as TemperatureDevice)
}

export default handler
