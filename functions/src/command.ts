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

  try {
    const responses = await iot.sendCommandToDevice(request)

    res.set('Access-Control-Allow-Origin', '*')
    res.send('Sent command: ', responses[0])
  } catch (err) {
    res.status(500)
    res.set('Access-Control-Allow-Origin', '*')
    res.send('Could not send command:', err)
  }
}

exports.storeCommand = async (message: Message, context: Context) => {
  const command = {
    timestamp: dayjs().format(),
    command: message,
  }
}
