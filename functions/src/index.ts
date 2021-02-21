import { storeInterphoneTelemetry as _storeInterphoneTelemetry } from './telemetry'
import {
  sendInterphoneCommand as _sendInterphoneCommand,
  storeInterphoneCommand as _storeInterphoneCommand,
  getInterphoneDeviceState as _getInterphoneDeviceState,
} from './command'
import { notifyInterphoneSlack as _notifyInterphoneSlack } from './notification'

export const storeInterphoneTelemetry = _storeInterphoneTelemetry
export const storeInterphoneCommand = _storeInterphoneCommand
export const getInterphoneDeviceState = _getInterphoneDeviceState
export const sendInterphoneCommand = _sendInterphoneCommand
export const notifyInterphoneSlack = _notifyInterphoneSlack
