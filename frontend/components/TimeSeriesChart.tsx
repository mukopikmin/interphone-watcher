import { ApexOptions } from 'apexcharts'
import locale from 'apexcharts/dist/locales/ja.json'
import dynamic from 'next/dynamic'
import dayjs from 'dayjs'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

export interface TimeSeriesDataProp {
  value: number
  timestamp: dayjs.Dayjs
}

interface Props {
  telemetry: TimeSeriesDataProp[]
  unit: string
}

const TimeSeriesChart: React.FC<Props> = (props: Props) => {
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
      },
    },
    yaxis: {
      labels: {
        formatter: (val) => `${val} ${props.unit}`,
      },
    },
    markers: {
      size: 0,
    },
    dataLabels: {
      enabled: false,
    },
  }
  const series = [
    {
      name: 'Brightness',
      data: props.telemetry.map((t) => ({
        x: t.timestamp.unix() * 1000,
        y: t.value,
      })),
    },
  ]

  return (
    <>
      <Chart options={options} series={series} type="area" height={250} />
    </>
  )
}

export default TimeSeriesChart
