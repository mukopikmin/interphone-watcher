import Link from 'next/link'
import { useDevicesQuery } from '../hooks/device'

const DeviceList = () => {
  const { data: devices, isLoading } = useDevicesQuery()

  if (isLoading) {
    return <p>Loading</p>
  }

  return (
    <ul>
      {devices?.map((device) => (
        <li key={device.id}>
          <Link href={`/devices/${device.id}`}>{device.id}</Link>
        </li>
      ))}
    </ul>
  )
}

export default DeviceList
