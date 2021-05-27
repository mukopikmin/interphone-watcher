import dayjs from 'dayjs'

export interface Device {
  // credentials: any[]
  metadata: Metadata
  id: string
  name: string
  numId: string
  // lastHeartbeatTime?: any
  // lastEventTime?: any
  // lastErrorTime?: any
  // lastErrorStatus?: anyd
  // config?: any
  // lastConfigAckTime?: any
  // state?: any
  // lastConfigSendTime?: any
  blocked: boolean
  // lastStateTime?: any
  // logLevel: string
  // gatewayConfig?: any
}

interface Metadata {
  location?: string
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
