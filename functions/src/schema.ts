export interface Message {
  data: string
}

export interface Telemetry {
  start: string
  end: string
  max: number
  min: number
  average: number
  threshold: number
}

export interface Context {}

export interface DeviceConfigVersion {
  version: number
  cloudUpdateTime: string | null
  deviceAckTime: string | null
  config: DeviceConfig | null
}

export interface DeviceConfig {
  sensorEnabled: boolean
  threshold: number
  actOnce: boolean
}
