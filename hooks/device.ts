import { useMutation, useQuery } from 'react-query'
import { getDeviceConfigVersions, updateConfig } from '../apis'
import { DeviceConfig, DeviceConfigVersion } from '../interfaces'

export const useDeviceConfigVersionsQuery = (id: string) =>
  useQuery<DeviceConfigVersion[]>(['configVersions', id], () =>
    getDeviceConfigVersions(id)
  )

export const useDeviceConfigQuery = (id: string) => {
  const { data } = useDeviceConfigVersionsQuery(id)

  return data && data.length > 0 ? data[0] : null
}

export const useDeviceUpdateMutation = (id: string) =>
  useMutation((config: DeviceConfig) => updateConfig(id, config), {
    onError: (e: Error) => console.log(e),
  })
