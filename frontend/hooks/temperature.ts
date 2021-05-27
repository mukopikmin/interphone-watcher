import { useQuery, UseQueryResult } from 'react-query'
import { getDeviceTemperatureTelemetry } from '../apis/temperature'
import { TemperatureTelemetry } from '../models/temperature'

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
