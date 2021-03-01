import Link from 'next/link'
import { useQuery } from 'react-query'
import { getDevices } from '../apis'
import { Device } from '../interfaces'

const DeviceList = () => {
  const query = useQuery<Device[]>('devices', getDevices)

  if (query.isLoading) {
    return <p>Loading</p>
  }

  return (
    <ul>
      {query.data?.map((device) => (
        <li key={device.id}>
          <Link href={`/devices/${device.id}`}>{device.id}</Link>
        </li>
      ))}
    </ul>
  )
}

export default DeviceList
