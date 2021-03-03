import { IncomingWebhook } from '@slack/webhook'
import { Context, Message, Telemetry } from './schema'

const url = process.env.SLACK_WEBHOOK_URL

export const notifyInterphoneSlack = async (
  message: Message,
  _context: Context
) => {
  if (!url) {
    throw Error('Slack webhook is not specified')
  }

  const webhook = new IncomingWebhook(url)
  const raw = Buffer.from(message.data, 'base64').toString()
  const data: Telemetry = JSON.parse(raw)
  const { max, min, average, threshold } = data

  if (max > threshold) {
    await webhook.send({
      text: `Max: ${max}, Min: ${min}, Average: ${average}, Threshold: ${threshold}`,
    })
  } else {
    console.log('No action.')
  }
}
