import dayjs from 'dayjs'

export type User = {
  id: number
  name: string
}

export interface DeviceConfigVersion {
  version: number
  cloudUpdateTime: dayjs.Dayjs | null
  deviceAckTime: dayjs.Dayjs | null
  config: DeviceConfig | null
}

export interface DeviceConfig {
  sensorEnabled: boolean
  threshold: number
  actOnce: boolean
}

export interface Device {
  // credentials: any[]
  metadata: {}
  id: string
  name: string
  numId: string
  // lastHeartbeatTime?: any
  // lastEventTime?: any
  // lastErrorTime?: any
  // lastErrorStatus?: any
  // config?: any
  // lastConfigAckTime?: any
  // state?: any
  // lastConfigSendTime?: any
  // blocked: boolean
  // lastStateTime?: any
  // logLevel: string
  // gatewayConfig?: any
}
