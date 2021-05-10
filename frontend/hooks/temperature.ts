import { useQuery, UseQueryResult } from 'react-query'
import {
  getDeviceTemperatureTelemetry,
  getTemperatureDevice,
  getTemperatureDevices,
} from '../apis/temperature'
import {
  TemperatureDevice,
  TemperatureTelemetry,
} from '../interfaces/temperature'

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
