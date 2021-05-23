import React from 'react'

interface Props {
  children?: React.ReactNode
  index: number
  value: number
}

const TabPanel: React.FC<Props> = (props: Props) => {
  const { children, value, index } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && children}
    </div>
  )
}

export default TabPanel
