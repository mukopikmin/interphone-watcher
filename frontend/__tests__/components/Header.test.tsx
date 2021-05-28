import React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import Header from '@/components/Header'

jest.mock('next/link', () => {
  const Link = ({
    href,
    children,
  }: {
    href: string
    children: string
  }): JSX.Element => <a href={href}>{children}</a>

  return Link
})

describe('Header', () => {
  afterEach(cleanup)
  beforeEach(() => render(<Header />))

  it('renders component as expected', () => {
    const button = screen.getByText('House Dashboard')
    const logo = screen.getByTestId('logo')

    expect(button).toBeInTheDocument()
    expect(logo).toBeInTheDocument()
  })

  it('has link to top on logo', () => {
    const button = screen.getByText('House Dashboard')

    expect(button.closest('a')).toHaveAttribute('href', '/')
  })
})
