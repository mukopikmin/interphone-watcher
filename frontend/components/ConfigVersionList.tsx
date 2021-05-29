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
import StatusIcon from '@/components/StatusIcon'
import DayjsTime from '@/components/DayjsTime'
import { DeviceConfigVersion } from '@/models/iotcore'

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

interface ConfigVersionListItemProps {
  config: DeviceConfigVersion
  isActive: boolean
}

const ConfigVersionListItem: React.FC<ConfigVersionListItemProps> = (
  props: ConfigVersionListItemProps
) => {
  return (
    <TableRow key={props.config.version}>
      <TableCell>
        <StatusIcon active={props.isActive} />
      </TableCell>
      <TableCell>{props.config.version}</TableCell>
      <TableCell>
        <StatusIcon active={props.config.config?.interphoneEnabled} />
      </TableCell>
      <TableCell>{props.config.config?.soundVolume}</TableCell>
      <TableCell>
        <StatusIcon active={props.config.config?.detectOnce} />
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
        <CircularProgress data-testid="progress" />
      </div>
    )
  }

  return (
    <>
      <TableContainer component={Card} data-testid="versions-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Active</TableCell>
              <TableCell>Version</TableCell>
              <TableCell>Interphone</TableCell>
              <TableCell>Sound volume</TableCell>
              <TableCell>Detect once</TableCell>
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
