import { ApexOptions } from 'apexcharts'
import locale from 'apexcharts/dist/locales/ja.json'
import dynamic from 'next/dynamic'
import dayjs from 'dayjs'
import { TemperatureTelemetry } from '../interfaces/temperature'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface Props {
  telemetry: TemperatureTelemetry[]
}

const TemperatureTelemetryChart: React.FC<Props> = (props: Props) => {
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
    yaxis: [
      {
        labels: {
          formatter: (val) => `${val} ℃`,
        },
      },
      {
        opposite: true,
        labels: {
          formatter: (val) => `${val} %`,
        },
      },
    ],
    markers: {
      size: 0,
    },
    dataLabels: {
      enabled: false,
    },
  }
  const series = [
    {
      name: 'Temperature',
      data: props.telemetry.map((t) => ({
        x: t.timestamp.unix() * 1000,
        y: t.temperature,
      })),
    },
    {
      name: 'Humidity',
      data: props.telemetry.map((t) => ({
        x: t.timestamp.unix() * 1000,
        y: t.humidity,
      })),
    },
  ]

  return (
    <>
      <Chart options={options} series={series} type="area" height={350} />
    </>
  )
}

export default TemperatureTelemetryChart
