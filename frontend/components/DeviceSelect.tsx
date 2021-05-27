import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import { ChangeEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import MenuItem from '@material-ui/core/MenuItem'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Device } from '@/models/iotcore'

interface Props {
  devices?: Device[]
  onSelect: (device: Device) => void
}

interface DropdownProps {
  children?: React.ReactNode
}

interface ChangeEventProps {
  name?: string
  value: unknown
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      margin: theme.spacing(1),
      position: 'relative',
    },
    buttonProgress: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
  })
)

const Dropdown: React.FC<DropdownProps> = (props: DropdownProps) => {
  return (
    <FormControl size="small" variant="outlined">
      <InputLabel>Device</InputLabel>
      {props.children}
    </FormControl>
  )
}

const DeviceSelect: React.FC<Props> = (props: Props) => {
  const classes = useStyles()
  const router = useRouter()
  const [device, setDevice] = useState<Device>()
  const onChangeDevice = (e: ChangeEvent<ChangeEventProps>) => {
    const id = e.target.value as string
    const device = props?.devices?.find((device) => device.id === id)

    if (device) {
      setDevice(device)
    }
  }
  const loading = !props.devices || !device

  useEffect(() => {
    if (router.query.id) {
      const device = props?.devices?.find(
        (device) => device.id === router.query.id
      )

      setDevice(device)
    }
  }, [router.query, props])

  useEffect(() => {
    if (device) {
      props.onSelect(device)
    }
  }, [device])

  if (loading) {
    return (
      <Dropdown>
        <Select onChange={onChangeDevice} label="Device" disabled value="dummy">
          <MenuItem value="dummy"></MenuItem>
        </Select>
        <CircularProgress size={24} className={classes.buttonProgress} />
      </Dropdown>
    )
  }

  return (
    <Dropdown>
      <Select onChange={onChangeDevice} label="Device" value={device?.id}>
        {props?.devices?.map((device) => (
          <MenuItem key={device.id} value={device.id}>
            {device.metadata.location || 'Unknown'} - {device.id}
          </MenuItem>
        ))}
      </Select>
    </Dropdown>
  )
}

export default DeviceSelect
