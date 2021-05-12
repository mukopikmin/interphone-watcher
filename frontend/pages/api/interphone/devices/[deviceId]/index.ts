import { NextApiRequest, NextApiResponse } from 'next'
import { v1 as iotCore } from '@google-cloud/iot'
import dayjs from 'dayjs'
import {
  InterphoneDeviceConfig,
  InterphoneDeviceConfigVersion,
} from '../../../../../models/interphone'

const region = process.env.REGION || ''
const projectId = process.env.GCP_PROJECT || ''
const registryId = process.env.REGISTRY_ID || ''

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  const deviceId = req.query.deviceId.toString()
  const iot = new iotCore.DeviceManagerClient()
  const devicePath = iot.devicePath(projectId, region, registryId, deviceId)
  const [configVersions] = await iot.listDeviceConfigVersions({
    name: devicePath,
  })

  const { deviceConfigs } = configVersions

  if (!deviceConfigs) {
    return res.status(500).send({})
  }

  const configs: InterphoneDeviceConfigVersion[] = deviceConfigs.map(
    (version) => {
      const binaryData = version.binaryData?.toString()
      const cloudUpdateTime = dayjs.unix(
        Number(version.cloudUpdateTime?.seconds)
      )
      const cloudUpdateTimeStr = cloudUpdateTime.isValid()
        ? cloudUpdateTime
        : null
      const deviceAckTime = dayjs.unix(Number(version.deviceAckTime?.seconds))
      const deviceAckTimeStr = deviceAckTime.isValid() ? deviceAckTime : null

      if (binaryData) {
        const config: InterphoneDeviceConfig = JSON.parse(binaryData)

        return {
          version: Number(version.version),
          cloudUpdateTime: cloudUpdateTimeStr,
          deviceAckTime: deviceAckTimeStr,
          config,
        }
      }

      return {
        version: Number(version.version),
        cloudUpdateTime: cloudUpdateTimeStr,
        deviceAckTime: deviceAckTimeStr,
        config: null,
      }
    }
  )

  res.setHeader('Content-Type', 'applciation/json')
  res.status(200).json(configs)
}

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  const deviceId = req.query.deviceId.toString()
  const iot = new iotCore.DeviceManagerClient()
  const config = req.body as InterphoneDeviceConfig
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

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method === 'POST') {
    handlePost(req, res)
  } else {
    handleGet(req, res)
  }
}

export default handler
