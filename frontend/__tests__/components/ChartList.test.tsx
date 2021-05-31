import { cleanup, render, screen } from '@testing-library/react'
import dayjs from 'dayjs'
import ChartList from '@/components/ChartList'
import { TemperatureTelemetry } from '@/models/firestore'

describe('ChartList', () => {
  afterEach(cleanup)

  describe('without telemetry given', () => {
    beforeEach(() => render(<ChartList loading={true} />))

    it('renders component as expected', () => {
      const temperature = screen.queryByText('Temperature')
      const humidity = screen.queryByText('Humidity')
      const brightness = screen.queryByText('Brightness')

      expect(temperature).toBeInTheDocument()
      expect(humidity).toBeInTheDocument()
      expect(brightness).toBeInTheDocument()
    })
  })

  describe('with telemetry given', () => {
    const telemetry: TemperatureTelemetry[] = [
      {
        temperature: 0,
        humidity: 0,
        brightness: 0,
        timestamp: dayjs(),
      },
    ]
    beforeEach(() => render(<ChartList telemetry={telemetry} loading={true} />))

    it('renders component as expected', () => {
      const temperature = screen.queryByText('Temperature')
      const humidity = screen.queryByText('Humidity')
      const brightness = screen.queryByText('Brightness')

      expect(temperature).toBeInTheDocument()
      expect(humidity).toBeInTheDocument()
      expect(brightness).toBeInTheDocument()
    })
  })
})
