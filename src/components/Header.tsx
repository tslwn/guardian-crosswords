/** @jsx jsx */
import React from 'react'
import { jsx, Heading } from 'theme-ui'

const Header: React.FC<{ title: string }> = ({ title }) => (
  <header sx={{ bg: 'primary', color: 'white', p: 3 }}>
    <Heading as="h1">{title}</Heading>
  </header>
)

export default Header
