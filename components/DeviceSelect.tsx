import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import { Device } from '../interfaces'
import { ChangeEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import MenuItem from '@material-ui/core/MenuItem'

interface Props {
  devices: Device[]
}

interface ChangeEventProps {
  name?: string
  value: unknown
}

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    formControl: {},
  })
)

const DeviceSelect = (props: Props) => {
  const classes = useStyles()
  const router = useRouter()
  const [device, setDevice] = useState<Device>()
  const onChangeDevice = (e: ChangeEvent<ChangeEventProps>) => {
    const id = e.target.value as string
    const device = props?.devices.find((device) => device.id === id)
    console.log(e)
    console.log(device)

    if (device) {
      setDevice(device)
    }
  }

  useEffect(() => {
    if (router.query.id) {
      const device = props?.devices.find(
        (device) => device.id === router.query.id
      )

      setDevice(device)
    }
  }, [router.query, props])

  useEffect(() => {
    if (device) {
      router.push(`/devices/${device.id}`)
    }
  }, [device])

  if (!device) {
    return <></>
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
          {props.devices.map((device) => (
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
