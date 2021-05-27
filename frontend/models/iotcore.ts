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
