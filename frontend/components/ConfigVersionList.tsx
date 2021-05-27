import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import React from 'react'
import { DeviceConfigVersion } from '../models/iotcore'
import StatusIcon from './StatusIcon'
import DayjsTime from './DayjsTime'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    progress: {
      display: 'flex',
      marginTop: theme.spacing(10),
      justifyContent: 'center',
    },
  })
)

interface ConfigVersionListProps {
  configVersions?: DeviceConfigVersion[]
  isLoading: boolean
}

interface ConfigVersionListItem {
  config: DeviceConfigVersion
  isActive: boolean
}

const ConfigVersionListItem: React.FC<ConfigVersionListItem> = (
  props: ConfigVersionListItem
) => {
  return (
    <TableRow key={props.config.version}>
      <TableCell>
        <StatusIcon active={props.isActive} />
      </TableCell>
      <TableCell>{props.config.version}</TableCell>
      <TableCell>
        <StatusIcon active={props.config.config?.sensorEnabled} />
      </TableCell>
      <TableCell>{props.config.config?.threshold}</TableCell>
      <TableCell>
        <StatusIcon active={props.config.config?.actOnce} />
      </TableCell>
      <TableCell>
        <DayjsTime time={props.config.cloudUpdateTime} />
      </TableCell>
      <TableCell>
        <DayjsTime time={props.config.deviceAckTime} />
      </TableCell>
    </TableRow>
  )
}

const ConfigVersionList: React.FC<ConfigVersionListProps> = (
  props: ConfigVersionListProps
) => {
  const classes = useStyles()
  const configVersions = props.configVersions || []
  const activeVersion = configVersions
    .filter((config) => config.deviceAckTime)
    .map((config) => config.version)
    .reduce((pre, cur) => (cur > pre ? cur : pre), 0)

  if (props.isLoading) {
    return (
      <div className={classes.progress}>
        <CircularProgress />
      </div>
    )
  }

  return (
    <>
      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Active</TableCell>
              <TableCell>Version</TableCell>
              <TableCell>Enabled</TableCell>
              <TableCell>Threshold</TableCell>
              <TableCell>Act Once</TableCell>
              <TableCell>Server updated</TableCell>
              <TableCell>Device updated</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {configVersions.map((config) => (
              <ConfigVersionListItem
                key={config.version}
                config={config}
                isActive={config.version === activeVersion}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default ConfigVersionList
