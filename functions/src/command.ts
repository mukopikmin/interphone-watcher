import { v1 as iotCore } from '@google-cloud/iot'
import { Storage } from '@google-cloud/storage'
import * as dayjs from 'dayjs'
import {
  Context,
  DeviceConfig,
  DeviceConfigVersion,
  Message,
  Request,
  Response,
} from './schema'

const region = process.env.REGION || ''
const projectId = process.env.GCP_PROJECT || ''
const registryId = process.env.REGISTRY_ID || ''
const commandBucket = process.env.COMMAND_LOGS_BUCKET || ''

export const sendInterphoneCommand = async (req: Request, res: Response) => {
  const iot = new iotCore.DeviceManagerClient({
    // optional auth parameters.
  })
  const commandMessage = req.query.command
  const commandDevice = req.query.device
  const formattedName = iot.devicePath(
    projectId,
    region,
    registryId,
    commandDevice
  )
  const binaryData = Buffer.from(commandMessage)
  const request = {
    name: formattedName,
    binaryData: binaryData,
  }

  res.set('Access-Control-Allow-Origin', '*')
  res.set('Content-Type', 'application/json')

  try {
    const responses = await iot.modifyCloudToDeviceConfig(request)

    res.status(200).send(responses)
  } catch (err) {
    res.status(500).send(err)
  }
}

export const storeInterphoneCommand = async (
  message: Message,
  context: Context
) => {
  const storage = new Storage()
  const bucket = storage.bucket(commandBucket)
  const timestamp = dayjs().format()
  const logFile = bucket.file(timestamp)
  const lastLogFile = bucket.file('last')
  const content = JSON.stringify({
    timestamp,
    command: message,
  })

  await logFile.save(content)
  await lastLogFile.save(content)
}

export const getInterphoneDeviceState = async (req: Request, res: Response) => {
  const deviceId = 'macmini'
  const iot = new iotCore.DeviceManagerClient()
  const devicePath = iot.devicePath(projectId, region, registryId, deviceId)
  const [response] = await iot.listDeviceStates({ name: devicePath })
  const states = response.deviceStates

  if (states && states.length === 0) {
    console.log(`No States for device: ${deviceId}`)
  } else {
    console.log(`States for device: ${deviceId}`)
  }

  const [configVersions] = await iot.listDeviceConfigVersions({
    name: devicePath,
  })
  const { deviceConfigs } = configVersions

  res.set('Access-Control-Allow-Origin', '*')
  res.set('Content-Type', 'application/json')

  if (!deviceConfigs) {
    return res.status(500).send({})
  }

  const configs: DeviceConfigVersion[] = deviceConfigs.map((version) => {
    const binaryData = version.binaryData?.toString()
    const cloudUpdateTime = dayjs
      .unix(Number(version.cloudUpdateTime?.seconds))
      .format()
    const deviceAckTime = dayjs
      .unix(Number(version.deviceAckTime?.seconds))
      .format()

    if (binaryData) {
      const config: DeviceConfig = JSON.parse(binaryData)

      return {
        version: Number(version.version),
        cloudUpdateTime,
        deviceAckTime,
        config,
      }
    }

    return {
      version: Number(version.version),
      cloudUpdateTime,
      deviceAckTime,
      config: null,
    }
  })

  res.send(configs)
}
