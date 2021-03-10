import { DeviceConfigVersion } from '../interfaces'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import DayjsTime from './DayjsTime'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import CheckIcon from '@material-ui/icons/Check'
import RemoveIcon from '@material-ui/icons/Remove'
import StatusIcon from './StatusIcon'

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
}

const ConfigVersionListItem = (props: ConfigVersionListItem) => {
  return (
    <TableRow key={props.config.version}>
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

const ConfigVersionList = (props: ConfigVersionListProps) => {
  const classes = useStyles()
  const configVersions = props.configVersions || []

  if (props.isLoading) {
    return (
      <div className={classes.progress}>
        <CircularProgress />
      </div>
    )
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
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
              <ConfigVersionListItem key={config.version} config={config} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default ConfigVersionList
