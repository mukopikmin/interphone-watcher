import React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import ConfigVersionList from '@/components/ConfigVersionList'

describe('ConfigVersionList', () => {
  afterEach(cleanup)

  describe('on loading', () => {
    beforeEach(() => render(<ConfigVersionList isLoading={true} />))

    it('renders component as expected', () => {
      const progress = screen.getByTestId('progress')

      expect(progress).toBeInTheDocument()
    })
  })

  describe('on loaded', () => {
    beforeEach(() => render(<ConfigVersionList isLoading={false} />))

    it('renders component as expected', () => {
      const progress = screen.queryByTestId('progress')

      expect(progress).toBeNull()
    })
  })
})
