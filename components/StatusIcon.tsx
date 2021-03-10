import CheckIcon from '@material-ui/icons/Check'
import RemoveIcon from '@material-ui/icons/Remove'

interface Props {
  active?: boolean
}

const StatusIcon = (props: Props) =>
  props.active ? (
    <CheckIcon color="secondary" />
  ) : (
    <RemoveIcon color="disabled" />
  )

export default StatusIcon
