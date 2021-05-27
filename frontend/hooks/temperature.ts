import { useQuery, UseQueryResult } from 'react-query'
import {
  getDeviceTemperatureTelemetry,
  getDevice,
  getDevices,
} from '../apis/temperature'
import { Device } from '../models/iotcore'
import { TemperatureTelemetry } from '../models/temperature'

export const useDevices = (): UseQueryResult<Device[], Error> =>
  useQuery(['temperature', 'devices'], getDevices)

export const useDevice = (id: string): UseQueryResult<Device, Error> =>
  useQuery(['temperature', 'devices', id], () => getDevice(id))

export const useTemperatureDeviceTelemetry = (
  id: string
): UseQueryResult<TemperatureTelemetry[], Error> =>
  useQuery(['temperature', 'devices', id, 'telemetry'], () =>
    getDeviceTemperatureTelemetry(id)
  )

export const useTemperatureDeviceLastTelemetry = (
  id: string
): UseQueryResult<TemperatureTelemetry | null, Error> =>
  useQuery(['temperature', 'devices', id, 'telemetry'], async () => {
    const telemetry = await getDeviceTemperatureTelemetry(id)

    return telemetry.length > 0 ? telemetry[telemetry.length - 1] : null
  })
