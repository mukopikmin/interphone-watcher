import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from 'react-query'
import { getDeviceConfigVersions, getDevices, updateConfig } from '../apis'
import {
  InterphoneDevice,
  InterphoneDeviceConfig,
  InterphoneDeviceConfigVersion,
} from '../interfaces/interphone'

export const useDevicesQuery = (): UseQueryResult<InterphoneDevice[], Error> =>
  useQuery('devices', getDevices, {
    initialData: [],
  })

export const useDeviceConfigVersionsQuery = (
  id: string
): UseQueryResult<InterphoneDeviceConfigVersion[], Error> =>
  useQuery(['configVersions', id], () => getDeviceConfigVersions(id), {
    enabled: !!id,
  })

export const useDevicesConfigVersionsQuery = (
  ids?: string[]
): UseQueryResult<InterphoneDeviceConfigVersion[][], Error> =>
  useQuery(
    ['configVersions', ids],
    () => Promise.all(ids?.map(getDeviceConfigVersions) || []),
    { enabled: ids && ids.length > 0 }
  )

export const useDeviceConfigQuery = (
  id: string
): InterphoneDeviceConfig | null => {
  const { data } = useDeviceConfigVersionsQuery(id)

  return data && data[0] && data[0].config ? data[0].config : null
}

export const useDeviceUpdateMutation = (
  id: string
): UseMutationResult<void, Error, InterphoneDeviceConfig, unknown> =>
  useMutation((config: InterphoneDeviceConfig) => updateConfig(id, config), {
    onError: (e: Error) => console.log(e),
  })
