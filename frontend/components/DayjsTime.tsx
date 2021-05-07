import dayjs from 'dayjs'

interface Props {
  time: dayjs.Dayjs | null
}

const format = 'YYYY/MM/DD HH:mm:ss'

const DayjsTime: React.FC<Props> = (props: Props) => (
  <>{props.time ? props.time.format(format) : ''}</>
)

export default DayjsTime
