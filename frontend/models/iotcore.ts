import dayjs from 'dayjs'

interface Timestamp {
  seconds: string
  nanos: number
}

export interface Device {
  metadata: Metadata
  id: string
  name: string
  numId: string
  lastHeartbeatTime?: Timestamp
  lastEventTime?: Timestamp
  lastErrorTime?: Timestamp
  lastErrorStatus?: {
    details: string[]
    code: number
    message: string
  }
  config?: {
    version: string
    cloudUpdateTime: Timestamp
    deviceAckTime: Timestamp
    binaryData: ArrayBuffer
  }
  lastConfigAckTime?: Timestamp
  state?: {}
  lastConfigSendTime?: Timestamp
  blocked: boolean
  lastStateTime?: Timestamp
  logLevel?: string
  gatewayConfig?: {
    gatewayType: string
    gatewayAuthMethod: string
    lastAccessedGatewayId: string
    lastAccessedGatewayTime?: Timestamp
  }
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
  interphoneEnabled: boolean
  detectOnce: boolean
  soundVolume: number
}

export const initialDeviceConfig: DeviceConfig = {
  interphoneEnabled: false,
  soundVolume: 0.1,
  detectOnce: false,
}
