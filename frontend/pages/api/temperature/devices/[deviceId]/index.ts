import { NextApiRequest, NextApiResponse } from 'next'
import { v1 as iotCore } from '@google-cloud/iot'
import {
  TemperatureDevice,
  TemperatureDeviceMetadata,
} from '../../../../../interfaces/temperature'

const region = process.env.REGION || ''
const projectId = process.env.GCP_PROJECT || ''
const registryId = process.env.TEMPERATURE_REGISTRY_ID || ''

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  const deviceId = req.query.deviceId.toString()
  const iot = new iotCore.DeviceManagerClient()
  const devicePath = iot.devicePath(projectId, region, registryId, deviceId)
  const [iotDevice] = await iot.getDevice({
    name: devicePath,
    fieldMask: { paths: ['metadata', 'config'] },
  })
  const metadata = iotDevice.metadata as TemperatureDeviceMetadata
  const device: TemperatureDevice = {
    id: deviceId,
    location: metadata.location,
    telemetry: null,
  }

  res.setHeader('Content-Type', 'applciation/json')
  res.status(200).json(device)
}

// const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
//   const deviceId = req.query.deviceId.toString()
//   const iot = new iotCore.DeviceManagerClient()
//   const config = req.body as DeviceConfig
//   const request = {
//     name: iot.devicePath(projectId, region, registryId, deviceId),
//     binaryData: Buffer.from(JSON.stringify(config)),
//   }

//   res.setHeader('Content-Type', 'applciation/json')

//   try {
//     const responses = await iot.modifyCloudToDeviceConfig(request)

//     res.status(200).send(responses)
//   } catch (err) {
//     res.status(500).send(err)
//   }
// }

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  // if (req.method === 'POST') {
  //   handlePost(req, res)
  // } else {
  handleGet(req, res)
  // }
}

export default handler
