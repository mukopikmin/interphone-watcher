import { useEffect, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import {
  useDeviceConfigQuery,
  useDeviceConfigVersionsQuery,
} from '../hooks/iotcore'
import { DeviceConfig } from '../models/iotcore'
import DeviceSettingForm from './DeviceSettingForm'
import SubmitSettingsButton from './SubmitSettingsButton'
import ConfigVersionList from './ConfigVersionList'

interface Props {
  deviceId: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    versionList: {
      marginTop: theme.spacing(1),
    },
  })
)

const initialConfig: DeviceConfig = {
  sensorEnabled: false,
  threshold: 100,
  actOnce: false,
}

const DeviceSetting: React.FC<Props> = (props: Props) => {
  const { deviceId } = props
  const classes = useStyles()
  const config = useDeviceConfigQuery(deviceId)
  const {
    data: configVersions,
    refetch,
    isFetching,
  } = useDeviceConfigVersionsQuery(deviceId)
  const [localConfig, setLocalConfig] = useState(initialConfig)
  const updateConfig = (config: DeviceConfig) => {
    setLocalConfig(config)
  }

  useEffect(() => {
    if (config) {
      setLocalConfig(config)
    }
  }, [config])

  return (
    <>
      <DeviceSettingForm
        deviceId={deviceId}
        updateConfig={updateConfig}
        config={localConfig}
      />
      <SubmitSettingsButton
        deviceId={deviceId}
        config={localConfig}
        refresh={refetch}
      />
      <div className={classes.versionList}>
        <ConfigVersionList
          configVersions={configVersions}
          isLoading={isFetching}
        />
      </div>
    </>
  )
}

export default DeviceSetting
