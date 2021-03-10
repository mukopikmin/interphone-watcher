import { useMutation, useQuery } from 'react-query'
import { getDeviceConfigVersions, getDevices, updateConfig } from '../apis'
import { Device, DeviceConfig, DeviceConfigVersion } from '../interfaces'

export const useDevicesQuery = () =>
  useQuery<Device[], Error>('devices', getDevices)

export const useDeviceConfigVersionsQuery = (id: string) =>
  useQuery<DeviceConfigVersion[], Error>(
    ['configVersions', id],
    () => getDeviceConfigVersions(id),
    { enabled: !!id }
  )

export const useDeviceConfigQuery = (id: string) => {
  const { data } = useDeviceConfigVersionsQuery(id)

  return data && data.length > 0 ? data[0] : null
}

export const useDeviceUpdateMutation = (id: string) =>
  useMutation((config: DeviceConfig) => updateConfig(id, config), {
    onError: (e: Error) => console.log(e),
  })
