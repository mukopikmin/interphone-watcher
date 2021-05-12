import { useQuery, UseQueryResult } from 'react-query'
import {
  getDeviceTemperatureTelemetry,
  getTemperatureDevice,
  getTemperatureDevices,
} from '../apis/temperature'
import { TemperatureDevice, TemperatureTelemetry } from '../models/temperature'

export const useTemperatureDevices = (): UseQueryResult<
  TemperatureDevice[],
  Error
> => useQuery(['temperature', 'devices'], getTemperatureDevices)

export const useTemperatureDevice = (
  id: string
): UseQueryResult<TemperatureDevice, Error> =>
  useQuery(['temperature', 'devices', id], () => getTemperatureDevice(id))

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
