import { ApexOptions } from 'apexcharts'
import locale from 'apexcharts/dist/locales/ja.json'
import dynamic from 'next/dynamic'
import dayjs from 'dayjs'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import { createStyles, makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loading: {
      textAlign: 'center',
      margin: theme.spacing(3),
    },
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

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

export interface TimeSeriesDataProp {
  value: number
  timestamp: dayjs.Dayjs
}

interface Props {
  telemetry: TimeSeriesDataProp[]
  unit: string
  loading: boolean
  name: string
}

const TimeSeriesChart: React.FC<Props> = (props: Props) => {
  const classes = useStyles()
  const options: ApexOptions = {
    chart: {
      locales: [locale],
      defaultLocale: 'ja',
      toolbar: {
        tools: {
          download: false,
          pan: false,
        },
      },
    },
    xaxis: {
      type: 'datetime',
      labels: {
        formatter: (_, timestamp) =>
          dayjs(timestamp).format('YYYY/MM/DD HH:mm'),
        rotate: 0,
      },
    },
    yaxis: {
      labels: {
        formatter: (val) => `${val.toFixed(0)} ${props.unit}`,
      },
      min: 0,
    },
    markers: {
      size: 0,
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: 'solid',
      opacity: 0.3,
    },
    stroke: {
      width: 2,
    },
  }
  const series = [
    {
      name: props.name,
      data: props.telemetry.map((t) => ({
        x: t.timestamp.unix() * 1000,
        y: t.value,
      })),
    },
  ]
  const noData = series[0].data.length === 0

  if (props.loading) {
    return (
      <div className={classes.loading}>
        <CircularProgress size={30} />
      </div>
    )
  }

  return (
    <div className={classes.wrapper}>
      <Chart options={options} series={series} type="area" height={250} />
      {noData && (
        <Typography variant="body1" className={classes.buttonProgress}>
          No data
        </Typography>
      )}
    </div>
  )
}

export default TimeSeriesChart
