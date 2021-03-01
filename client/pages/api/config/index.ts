import { NextApiRequest, NextApiResponse } from 'next'
import { DeviceConfig, DeviceConfigVersion } from '../../../interfaces'
import { v1 as iotCore } from '@google-cloud/iot'
import * as dayjs from 'dayjs'

const region = process.env.REGION || ''
const projectId = process.env.GCP_PROJECT || ''
const registryId = process.env.REGISTRY_ID || ''

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  const deviceId = 'macmini'
  const iot = new iotCore.DeviceManagerClient()
  const devicePath = iot.devicePath(projectId, region, registryId, deviceId)
  const [configVersions] = await iot.listDeviceConfigVersions({
    name: devicePath,
  })

  const { deviceConfigs } = configVersions

  if (!deviceConfigs) {
    return res.status(500).send({})
  }

  const configs: DeviceConfigVersion[] = deviceConfigs.map((version) => {
    const binaryData = version.binaryData?.toString()
    const cloudUpdateTime = dayjs.unix(Number(version.cloudUpdateTime?.seconds))
    const cloudUpdateTimeStr = cloudUpdateTime.isValid()
      ? cloudUpdateTime.format()
      : null
    const deviceAckTime = dayjs.unix(Number(version.deviceAckTime?.seconds))
    const deviceAckTimeStr = deviceAckTime.isValid()
      ? deviceAckTime.format()
      : null

    if (binaryData) {
      const config: DeviceConfig = JSON.parse(binaryData)

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
  })

  res.setHeader('Content-Type', 'applciation/json')
  res.status(200).json(configs)
}

export default handler
