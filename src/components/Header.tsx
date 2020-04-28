/** @jsx jsx */
import React from 'react'
import { jsx, Box, Heading } from 'theme-ui'

const Header: React.FC<{ title: string }> = ({ title }) => (
  <Box as="header" sx={{ bg: 'primary', color: 'white', p: 3, width: '100%' }}>
    <Heading as="h1">{title}</Heading>
  </Box>
)

export default Header
