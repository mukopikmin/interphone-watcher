import { v1 as iotCore } from '@google-cloud/iot'
import { Storage } from '@google-cloud/storage'
import * as dayjs from 'dayjs'
import { Context, Message, Request, Response } from './schema'

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
    const responses = await iot.sendCommandToDevice(request)

    res.status(200).send(responses[0])
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
