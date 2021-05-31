import { cleanup, render, screen } from '@testing-library/react'
import { Device } from '@/models/iotcore'
import DeviceSelect from '@/components/DeviceSelect'

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
    }
  },
}))

describe('DeviceSelect', () => {
  describe('without device given', () => {
    afterEach(cleanup)
    beforeEach(() => render(<DeviceSelect onSelect={(_: Device) => ({})} />))

    it('renders component as expected', () => {
      const progress = screen.queryByTestId('progress')

      expect(progress).toBeInTheDocument()
    })
  })

  xdescribe('with device given', () => {
    const devices: Device[] = [
      {
        id: '',
        name: '',
        numId: '',
        blocked: false,
        metadata: {
          location: '',
        },
      },
    ]

    afterEach(cleanup)
    beforeEach(() =>
      render(<DeviceSelect devices={devices} onSelect={(_: Device) => ({})} />)
    )

    it('renders component as expected', () => {
      const deviceSelect = screen.queryByTestId('device-select')

      expect(deviceSelect).toBeInTheDocument()
    })
  })
})
