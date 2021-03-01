import { useQuery } from 'react-query'
import { getDeviceConfigVersions } from '../apis'
import { DeviceConfigVersion } from '../interfaces'

const ConfigVersionList = (props: { deviceId: string }) => {
  const query = useQuery<DeviceConfigVersion[]>(
    ['configVersions', props.deviceId],
    () => getDeviceConfigVersions(props.deviceId)
  )

  if (query.isError && query.error instanceof Error) {
    return <p>{query.error}</p>
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <td>Version</td>
            <td>Enabled</td>
            <td>Threshold</td>
            <td>Server updated</td>
            <td>Device updated</td>
          </tr>
        </thead>
        <tbody>
          {query.data?.map((c) => (
            <tr key={c.version}>
              <td>{c.version}</td>
              <td>{c.config?.sensorEnabled ? 'o' : 'x'} </td>
              <td>{c.config?.threshold}</td>
              <td>{c.cloudUpdateTime}</td>
              <td>{c.deviceAckTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default ConfigVersionList
