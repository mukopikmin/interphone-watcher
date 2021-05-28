import { QueryClient, QueryClientProvider } from 'react-query'
import nock from 'nock'
import { ReactNode } from 'react'
import { renderHook } from '@testing-library/react-hooks'
import axios from 'axios'
import dayjs from 'dayjs'
import { TemperatureTelemetry } from '@/models/firestore'
import { useTemperatureDeviceTelemetry } from '@/hooks/firestore'

axios.defaults.adapter = require('axios/lib/adapters/http')

const queryClient = new QueryClient()
const wrapper = (props: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {props.children}
  </QueryClientProvider>
)

describe('hooks/temperature', () => {
  describe('useTemperatureDeviceTelemetry', () => {
    const deviceId = 'test'
    const telemetry: TemperatureTelemetry[] = [
      {
        humidity: 0,
        temperature: 0,
        brightness: 0,
        timestamp: dayjs(),
      },
    ]

    beforeAll(() => {
      nock('http://localhost')
        .get(`/api/devices/${deviceId}/temperature`)
        .reply(200, telemetry)
    })

    it('returns devices', async () => {
      const { result, waitFor } = renderHook(
        () => useTemperatureDeviceTelemetry(deviceId),
        {
          wrapper,
        }
      )

      await waitFor(() => {
        return result.current.isSuccess
      })

      expect(result.current.data).toEqual(telemetry)
    })
  })
})
