import { IncomingWebhook } from '@slack/webhook'
import * as dayjs from 'dayjs'

interface Event {
  attributes: {
    deviceId: string
    deviceNumId: string
    deviceRegistryId: string
    deviceRegistryLocation: string
    projectId: string
    subFolder: string
  }
  data: string
}

interface Context {
  eventId: string
  timestamp: string
  eventType: string
  resource: {
    service: string
    name: string
    type: string
  }
}

interface Telemetry {
  deviceId: string
  volume: number
  pattern: {
    high: number
    low: number
  }
}

export const notifyInterphoneSlack = async (event: Event, _: Context) => {
  const url = process.env.SLACK_WEBHOOK_URL

  if (!url) {
    throw Error('Slack webhook is not specified')
  }

  const webhook = new IncomingWebhook(url)
  const raw = Buffer.from(event.data, 'base64').toString()
  const telemetry: Telemetry = JSON.parse(raw)
  const { volume } = telemetry
  const now = dayjs().format('YYYY/MM/DD HH:mm:SS')
  const text = `Detected interphone with volume ${volume} at ${now}.`

  await webhook.send({
    text,
  })
}
