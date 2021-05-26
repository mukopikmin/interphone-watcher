import { NextApiRequest, NextApiResponse } from 'next'
import { v1 as iotCore } from '@google-cloud/iot'

const region = process.env.REGION || ''
const projectId = process.env.GCP_PROJECT || ''
const registryId = process.env.REGISTRY_ID || ''

const handler = async (
  _req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const iot = new iotCore.DeviceManagerClient()
  const registryPath = iot.registryPath(projectId, region, registryId)
  const [devices] = await iot.listDevices({ parent: registryPath })

  res.setHeader('Content-Type', 'applciation/json')
  res.status(200).json(devices)
}

export default handler
