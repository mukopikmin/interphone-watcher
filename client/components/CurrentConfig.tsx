import { DeviceConfig } from '../interfaces'

interface CurrenctConfigProps {
  config: DeviceConfig
}

const CurrentConfig = (props: CurrenctConfigProps) => {
  return (
    <>
      <p>Enabled: {props.config.sensorEnabled ? 'o' : 'x'}</p>
      <p>Threshold: {props.config.threshold}</p>
    </>
  )
}

export default CurrentConfig
