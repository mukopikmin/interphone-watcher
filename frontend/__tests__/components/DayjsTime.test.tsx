import React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import dayjs from 'dayjs'
import DayjsTime from '@/components/DayjsTime'

describe('DayjsTime', () => {
  afterEach(cleanup)

  describe('with non-null object', () => {
    const time = dayjs('2021-03-02 00:00:00')

    beforeEach(() => render(<DayjsTime time={time} />))

    it('renders component as expected', () => {
      const text = screen.queryByText('2021/03/02 00:00:00')

      expect(text).toBeInTheDocument()
    })
  })

  describe('with null', () => {
    beforeEach(() => render(<DayjsTime time={null} />))

    it('renders component as expected', () => {
      const text = screen.queryByText('2021/03/02 00:00:00')

      expect(text).not.toBeInTheDocument()
    })
  })
})
