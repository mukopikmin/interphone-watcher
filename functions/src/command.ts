import { v1 } from '@google-cloud/iot'
import * as dayjs from 'dayjs'
import { Context, Message, Request, Response } from './schema'

const region = process.env.REGION || ''
const projectId = process.env.GCP_PROJECT || ''
const registryId = process.env.REGISTRY_ID || ''

export const sendInterphoneCommand = async (req: Request, res: Response) => {
  const iot = new v1.DeviceManagerClient({
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

exports.storeCommand = async (message: Message, context: Context) => {
  const command = {
    timestamp: dayjs().format(),
    command: message,
  }
}
