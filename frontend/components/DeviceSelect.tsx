import { createStyles, makeStyles } from '@material-ui/core/styles'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import { ChangeEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import MenuItem from '@material-ui/core/MenuItem'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Device } from '../models/iotcore'

interface Props {
  devices?: Device[]
  onSelect: (device: Device) => void
}

interface ChangeEventProps {
  name?: string
  value: unknown
}

const useStyles = makeStyles(() =>
  createStyles({
    formControl: {},
  })
)

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

  if (!device) {
    return <CircularProgress size="2rem" />
  }

  return (
    <>
      <FormControl
        size="small"
        variant="outlined"
        className={classes.formControl}
      >
        <InputLabel>Device</InputLabel>
        <Select onChange={onChangeDevice} label="Device" value={device.id}>
          {props?.devices?.map((device) => (
            <MenuItem key={device.id} value={device.id}>
              {device.id}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  )
}

export default DeviceSelect
