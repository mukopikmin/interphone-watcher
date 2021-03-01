// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

export type User = {
  id: number
  name: string
}

export interface DeviceConfigVersion {
  version: number
  cloudUpdateTime: string | null
  deviceAckTime: string | null
  config: DeviceConfig | null
}

export interface DeviceConfig {
  sensorEnabled: boolean
  threshold: number
}

export interface Metadata {}

export interface Device {
  credentials: any[]
  metadata: Metadata
  id: string
  name: string
  numId: string
  lastHeartbeatTime?: any
  lastEventTime?: any
  lastErrorTime?: any
  lastErrorStatus?: any
  config?: any
  lastConfigAckTime?: any
  state?: any
  lastConfigSendTime?: any
  blocked: boolean
  lastStateTime?: any
  logLevel: string
  gatewayConfig?: any
}
