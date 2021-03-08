import Link from 'next/link'
import { useQuery } from 'react-query'
import { getDevices } from '../apis'
import { Device } from '../interfaces'

const DeviceList = () => {
  const { data, isLoading } = useQuery<Device[]>('devices', getDevices)

  if (isLoading) {
    return <p>Loading</p>
  }

  return (
    <ul>
      {data?.map((device) => (
        <li key={device.id}>
          <Link href={`/devices/${device.id}`}>{device.id}</Link>
        </li>
      ))}
    </ul>
  )
}

export default DeviceList
