import { useTemperatureDevices } from '../hooks/temperature'
import TemperatureSummary from './TemperatureSummary'

const TemperatureSummaryList = () => {
  const { data: devices } = useTemperatureDevices()

  return (
    <>
      {devices?.map((device) => (
        <TemperatureSummary device={device} />
      ))}
    </>
  )
}

export default TemperatureSummaryList
