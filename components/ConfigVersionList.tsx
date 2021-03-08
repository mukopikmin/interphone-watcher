import { useQuery } from 'react-query'
import { getDeviceConfigVersions } from '../apis'
import { DeviceConfigVersion } from '../interfaces'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import DayjsTime from './DayjsTime'

const ConfigVersionListItem = (props: { config: DeviceConfigVersion }) => {
  return (
    <TableRow key={props.config.version}>
      <TableCell>{props.config.version}</TableCell>
      <TableCell>{props.config.config?.sensorEnabled ? 'o' : 'x'} </TableCell>
      <TableCell>{props.config.config?.threshold}</TableCell>
      <TableCell>
        <DayjsTime time={props.config.cloudUpdateTime} />
      </TableCell>
      <TableCell>
        <DayjsTime time={props.config.deviceAckTime} />
      </TableCell>
    </TableRow>
  )
}

const ConfigVersionList = (props: { deviceId: string }) => {
  const { data, isError, error } = useQuery<DeviceConfigVersion[], Error>(
    ['configVersions', props.deviceId],
    () => getDeviceConfigVersions(props.deviceId)
  )

  if (isError && error) {
    return <p>{error}</p>
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
              <TableCell>Server updated</TableCell>
              <TableCell>Device updated</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((config) => (
              <ConfigVersionListItem key={config.version} config={config} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default ConfigVersionList
