import { Timestamp } from '@google-cloud/firestore'
import dayjs from 'dayjs'

export interface TemperatureDevice {
  id: string
  location?: string
  telemetry: TemperatureTelemetry | null
}

export interface TemperatureDeviceMetadata {
  location?: string
}

export interface TemperatureTelemetry {
  humidity: number
  temperature: number
  timestamp: dayjs.Dayjs
}

export interface TemperatureRawTelemetry {
  humidity: number
  temperature: number
  timestamp: Timestamp
}

// export interface Device {
//   // credentials: any[]
//   metadata: {
//     location?: string
//   }
//   id: string
//   name: string
//   numId: string
//   // lastHeartbeatTime?: any
//   // lastEventTime?: any
//   // lastErrorTime?: any
//   // lastErrorStatus?: any
//   config: {
//     version: string
//     cloudUpdateTime: {
//       seconds: string
//       nanos: number
//     }
//     deviceAckTime: {
//       seconds: string
//       nanos: number
//     }
//     binaryData: Buffer
//   }
//   // lastConfigAckTime?: any
//   // state?: any
//   // lastConfigSendTime?: any
//   blocked: boolean
//   // lastStateTime?: any
//   logLevel: string
//   // gatewayConfig?: any
// }
