import { NextApiRequest, NextApiResponse } from 'next'
import { v1 as iotCore } from '@google-cloud/iot'
import {
  TemperatureDevice,
} from '../../../../interfaces/temperature'

const region = process.env.REGION || ''
const projectId = process.env.GCP_PROJECT || ''
const registryId = process.env.TEMPERATURE_REGISTRY_ID || ''

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
  const devices: TemperatureDevice[] = iotDevices as TemperatureDevice[]

  res.setHeader('Content-Type', 'applciation/json')
  res.status(200).json(devices)
}

export default handler
