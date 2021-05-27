import Link from 'next/link'
import { useDevicesQuery } from '../hooks/iotcore'

const DeviceList: React.FC = () => {
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
