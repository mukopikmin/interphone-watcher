import CheckIcon from '@material-ui/icons/Check'
import RemoveIcon from '@material-ui/icons/Remove'

interface Props {
  active?: boolean
}

const StatusIcon: React.FC<Props> = (props: Props) =>
  props.active ? (
    <CheckIcon color="secondary" />
  ) : (
    <RemoveIcon color="disabled" />
  )

export default StatusIcon
