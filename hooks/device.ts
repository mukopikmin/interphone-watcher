import { useMutation, useQuery } from 'react-query'
import { getDeviceConfigVersions, getDevices, updateConfig } from '../apis'
import { Device, DeviceConfig, DeviceConfigVersion } from '../interfaces'

export const useDevicesQuery = () =>
  useQuery<Device[], Error>('devices', getDevices, {
    initialData: [],
  })

export const useDeviceConfigVersionsQuery = (id: string) =>
  useQuery<DeviceConfigVersion[], Error>(
    ['configVersions', id],
    () => getDeviceConfigVersions(id),
    { enabled: !!id }
  )

export const useDevicesConfigVersionsQuery = (ids?: string[]) =>
  useQuery<DeviceConfigVersion[][], Error>(
    ['configVersions', ids],
    () => Promise.all(ids?.map(getDeviceConfigVersions) || []),
    { enabled: ids && ids.length > 0 }
  )

export const useDeviceConfigQuery = (id: string) => {
  const { data } = useDeviceConfigVersionsQuery(id)

  return data && data[0] && data[0].config ? data[0].config : null
}

export const useDeviceUpdateMutation = (id: string) =>
  useMutation((config: DeviceConfig) => updateConfig(id, config), {
    onError: (e: Error) => console.log(e),
  })
