import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from 'react-query'
import {
  getDeviceConfigVersions,
  getDevices,
  getDevice,
  updateConfig,
} from '@/apis/iotcore'
import { Device, DeviceConfig, DeviceConfigVersion } from '@/models/iotcore'

export const useDevicesQuery = (): UseQueryResult<Device[], Error> =>
  useQuery(['devices'], getDevices)

export const useDeviceQuery = (id: string): UseQueryResult<Device, Error> =>
  useQuery(['devices', id], () => getDevice(id), {
    enabled: !!id,
  })

export const useDeviceConfigVersionsQuery = (
  id: string
): UseQueryResult<DeviceConfigVersion[], Error> =>
  useQuery(['configVersions', id], () => getDeviceConfigVersions(id), {
    enabled: !!id,
  })

export const useDevicesConfigVersionsQuery = (
  ids?: string[]
): UseQueryResult<DeviceConfigVersion[][], Error> =>
  useQuery(
    ['configVersions', ids],
    () => Promise.all(ids?.map(getDeviceConfigVersions) || []),
    { enabled: ids && ids.length > 0 }
  )

export const useDeviceConfigQuery = (id: string): DeviceConfig | null => {
  const { data } = useDeviceConfigVersionsQuery(id)

  return data && data[0] && data[0].config ? data[0].config : null
}

export const useDeviceUpdateMutation = (
  id: string
): UseMutationResult<void, Error, DeviceConfig, unknown> =>
  useMutation((config: DeviceConfig) => updateConfig(id, config), {
    onError: (e: Error) => console.log(e),
  })
