import { useEffect, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import {
  useDeviceConfigQuery,
  useDeviceConfigVersionsQuery,
} from '@/hooks/iotcore'
import { DeviceConfig, initialDeviceConfig } from '@/models/iotcore'
import DeviceSettingForm from '@/components/DeviceSettingForm'
import SubmitSettingsButton from '@/components/SubmitSettingsButton'
import ConfigVersionList from '@/components/ConfigVersionList'
import ResetButton from '@/components/ResetButton'

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

const DeviceSetting: React.FC<Props> = (props: Props) => {
  const { deviceId } = props
  const classes = useStyles()
  const config = useDeviceConfigQuery(deviceId)
  const {
    data: configVersions,
    refetch,
    isFetching,
  } = useDeviceConfigVersionsQuery(deviceId)
  const [localConfig, setLocalConfig] = useState(initialDeviceConfig)
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
      <div>
        <SubmitSettingsButton
          deviceId={deviceId}
          config={localConfig}
          refresh={refetch}
        />
        <ResetButton
          deviceId={deviceId}
          refetch={refetch}
          loading={isFetching}
        />
      </div>
      <DeviceSettingForm
        deviceId={deviceId}
        updateConfig={updateConfig}
        config={localConfig}
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
