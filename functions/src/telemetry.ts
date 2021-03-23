import { Storage } from '@google-cloud/storage'
import { v1 as iotCore } from '@google-cloud/iot'
import * as dayjs from 'dayjs'
import { Context, DeviceConfig, DeviceConfigVersion, Message } from './schema'
import { Request, Response } from 'express'

const bucketName = process.env.INTERPHONE_TELEMETRY_BUCKET

export const storeInterphoneTelemetry = async (
  message: Message,
  _context: Context
) => {
  if (!bucketName) {
    throw Error('No bucket is specified')
  }

  const raw = Buffer.from(message.data, 'base64').toString()
  const data = JSON.parse(raw)
  const storage = new Storage()
  const now = new dayjs.Dayjs()
  const bucket = storage.bucket(bucketName)
  const file = bucket.file(`${now.format()}.json`)

  await file.save(JSON.stringify(data))
}

export const stopInterphoneWatch = async (req: Request, res: Response) => {
  const iot = new iotCore.DeviceManagerClient()
  const deviceId = req.query.deviceId as string
  const previousConfig = (await getDeviceConfigVersions(deviceId)) || {
    threshold: 200,
    sensorEnabled: false,
    actOnce: true,
  }
  const config = { ...previousConfig, sensorEnabled: false }

  const projectId = process.env.GCP_PROJECT || ''
  const region = process.env.REGISTRY_REGION || ''
  const registryId = process.env.REGISTRY_ID || ''
  const request = {
    name: iot.devicePath(projectId, region, registryId, deviceId),
    binaryData: Buffer.from(JSON.stringify(config)),
  }

  res.setHeader('Content-Type', 'application/json')

  try {
    const responses = await iot.modifyCloudToDeviceConfig(request)

    res.status(200).send(responses)
  } catch (err) {
    res.status(500).send(err)
  }
}

const getDeviceConfigVersions = async (deviceId: string) => {
  const iot = new iotCore.DeviceManagerClient()
  const projectId = process.env.GCP_PROJECT || ''
  const region = process.env.REGISTRY_REGION || ''
  const registryId = process.env.REGISTRY_ID || ''
  const devicePath = iot.devicePath(projectId, region, registryId, deviceId)
  const [configVersions] = await iot.listDeviceConfigVersions({
    name: devicePath,
  })
  const { deviceConfigs } = configVersions

  const configs = deviceConfigs?.map((version) => {
    const binaryData = version.binaryData?.toString()
    const cloudUpdateTime = dayjs.unix(Number(version.cloudUpdateTime?.seconds))
    const cloudUpdateTimeStr = cloudUpdateTime.isValid()
      ? cloudUpdateTime
      : null
    const deviceAckTime = dayjs.unix(Number(version.deviceAckTime?.seconds))
    const deviceAckTimeStr = deviceAckTime.isValid() ? deviceAckTime : null

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

  return configs && configs[0] ? configs[0].config : null
}
