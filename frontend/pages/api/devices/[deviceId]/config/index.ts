import { NextApiRequest, NextApiResponse } from 'next'
import { v1 as iotCore } from '@google-cloud/iot'
import {
  DeviceConfig,
} from '../../../../../models/iotcore'

const region = process.env.REGION || ''
const projectId = process.env.GCP_PROJECT || ''
const registryId = process.env.REGISTRY_ID || ''

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const deviceId = req.query.deviceId.toString()
  const iot = new iotCore.DeviceManagerClient()
  const config = req.body as DeviceConfig
  const request = {
    name: iot.devicePath(projectId, region, registryId, deviceId),
    binaryData: Buffer.from(JSON.stringify(config)),
  }

  res.setHeader('Content-Type', 'applciation/json')

  try {
    const responses = await iot.modifyCloudToDeviceConfig(request)

    res.status(200).send(responses)
  } catch (err) {
    res.status(500).send(err)
  }
}

export default handler
