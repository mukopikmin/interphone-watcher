import { NextApiRequest, NextApiResponse } from 'next'
import { v1 as iotCore } from '@google-cloud/iot'
import { Device } from '../../../../models/iotcore'

const region = process.env.REGION || ''
const projectId = process.env.GCP_PROJECT || ''
const registryId = process.env.REGISTRY_ID || ''

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const deviceId = req.query.deviceId.toString()
  const iot = new iotCore.DeviceManagerClient()
  const devicePath = iot.devicePath(projectId, region, registryId, deviceId)
  const [iotDevice] = await iot.getDevice({
    name: devicePath,
    fieldMask: {
      paths: [
        'id',
        'metadata',
        'config',
        'last_heartbeat_time',
        'last_event_time',
        'last_error_time',
        'last_error_status',
        'last_config_ack_time',
        'state',
        'last_config_send_time',
        'last_state_time',
        'gateway_config',
      ],
    },
  })

  res.setHeader('Content-Type', 'applciation/json')
  res.status(200).json(iotDevice as Device)
}

export default handler
