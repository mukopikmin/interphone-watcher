import { useQuery } from 'react-query'
import { getTemperatureDevices } from '../apis/temperature'
import { TemperatureDevice } from '../interfaces/temperature'
// import { getDeviceTemperatureTelemetry } from '../apis/temperature'

// export const useDeviceTemperatureTelemetry = (deviceId: string) =>
//   useQuery<DeviceTemperatureTelemetry[], Error>(
//     ['temperature', deviceId],
//     () => getDeviceTemperatureTelemetry(deviceId),
//     { enabled: !!deviceId }
//   )

// export const useDevicesTemperature = (deviceIds?: string[]) =>
//   useQuery<DeviceTemperatureTelemetry[][], Error>(
//     ['temperature'],
//     () => Promise.all(deviceIds?.map(getDeviceTemperatureTelemetry) || []),
//     { enabled: deviceIds && deviceIds.length > 0 }
//   )

// export const useTemperature = (deviceIds?: string[]) => {
//   const { data: devices } = useDevicesTemperature(deviceIds)

//   return devices?.map((telemetries, index) => {
//     if (telemetries.length > 0) {
//       const telemetry = telemetries[0]

//       return {
//         deviceId: deviceIds![index],
//         temperature: telemetry.temperature,
//         humidity: telemetry.humidity,
//       }
//     }

//     return null
//   })
// }

export const useTemperatureDevices = () =>
  useQuery<TemperatureDevice[], Error>(
    ['temperature', 'devices'],
    getTemperatureDevices
  )
