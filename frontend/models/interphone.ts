import dayjs from 'dayjs'
import { Device } from './iotcore'

export interface InterphoneDeviceConfigVersion {
  version: number
  cloudUpdateTime: dayjs.Dayjs | null
  deviceAckTime: dayjs.Dayjs | null
  config: InterphoneDeviceConfig | null
}

export interface InterphoneDeviceConfig {
  sensorEnabled: boolean
  threshold: number
  actOnce: boolean
}

export interface InterphoneDevice extends Device {
  config: InterphoneDeviceConfig
}
