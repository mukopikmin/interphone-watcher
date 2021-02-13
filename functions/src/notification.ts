import { IncomingWebhook } from '@slack/webhook'
import { Context, Message, Telemetry } from './schema'

const url = process.env.SLACK_WEBHOOK_URL
const threshold = process.env.SOUND_THRESHOLD || 120

export const notifyInterphoneSlack = async (
  message: Message,
  context: Context
) => {
  if (!url) {
    throw Error('Slack webhook is not specified')
  }

  const webhook = new IncomingWebhook(url)
  const raw = Buffer.from(message.data, 'base64').toString()
  const data: Telemetry = JSON.parse(raw)

  if (data.max > threshold) {
    await webhook.send({
      text: `Sound sensor: ${data.max}`,
    })
  } else {
    console.log('No action.')
  }
}
