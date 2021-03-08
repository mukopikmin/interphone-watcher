import dayjs from 'dayjs'

const format = 'YYYY/MM/DD HH:mm:ss'

const DayjsTime = (props: { time: dayjs.Dayjs | null }) => (
  <>{props.time ? props.time.format(format) : ''}</>
)

export default DayjsTime
