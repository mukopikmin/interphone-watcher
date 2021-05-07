import React from 'react'
import { useTemperatureDevices } from '../hooks/temperature'
import TemperatureSummary from './TemperatureSummary'

const TemperatureSummaryList: React.FC = () => {
  const { data: devices } = useTemperatureDevices()

  return (
    <>
      {devices?.map((device) => (
        <TemperatureSummary key={device.id} device={device} />
      ))}
    </>
  )
}

export default TemperatureSummaryList
