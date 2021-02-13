export interface Request {
  query: {
    command: string
    device: string
  }
}

export interface Response {
  set: Function
  send: Function
  status: Function
}

export interface Message {
  data: string
}

export interface Telemetry {
  start: string
  end: string
  max: number
  min: number
  average: number
}

export interface Context {}
