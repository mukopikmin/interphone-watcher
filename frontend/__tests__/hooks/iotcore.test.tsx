import { QueryClient, QueryClientProvider } from 'react-query'
import nock from 'nock'
import { ReactNode } from 'react'
import { renderHook } from '@testing-library/react-hooks'
import axios from 'axios'
import { useDevicesQuery } from '@/hooks/iotcore'
import { Device } from '@/models/iotcore'

axios.defaults.adapter = require('axios/lib/adapters/http')

const queryClient = new QueryClient()
const wrapper = (props: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {props.children}
  </QueryClientProvider>
)

describe('hooks/iotcore', () => {
  describe('useDevicesQuery', () => {
    const devices: Device[] = [
      {
        id: 'test',
        numId: '',
        name: '',
        metadata: {
          location: '',
        },
        blocked: false,
      },
    ]

    beforeAll(() => {
      nock('http://localhost').get('/api/devices').reply(200, devices)
    })

    it('returns devices', async () => {
      const { result, waitFor } = renderHook(() => useDevicesQuery(), {
        wrapper,
      })

      await waitFor(() => {
        return result.current.isSuccess
      })

      expect(result.current.data).toEqual(devices)
    })
  })
})
