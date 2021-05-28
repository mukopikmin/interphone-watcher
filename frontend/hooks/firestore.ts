import { useQuery, UseQueryResult } from 'react-query'
import { getDeviceTemperatureTelemetry } from '../apis/firestore'
import { TemperatureTelemetry } from '../models/firestore'

export const useTemperatureDeviceTelemetry = (
  id: string
): UseQueryResult<TemperatureTelemetry[], Error> =>
  useQuery(['temperature', 'devices', id, 'telemetry'], () =>
    getDeviceTemperatureTelemetry(id)
  )

export const useTemperatureDeviceLastTelemetry = (
  id: string
): UseQueryResult<TemperatureTelemetry | null, Error> =>
  useQuery(['temperature', 'devices', id, 'telemetry', 'last'], async () => {
    const telemetry = await getDeviceTemperatureTelemetry(id)

    return telemetry.length > 0 ? telemetry[telemetry.length - 1] : null
  })
