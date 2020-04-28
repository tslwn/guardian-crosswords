/** @jsx jsx */
import React from 'react'
import { jsx, Box } from 'theme-ui'

const Main: React.FC = ({ children, ...props }) => (
  <Box as="main" sx={{ flex: '1 1 auto', width: '100%' }} {...props}>
    {children}
  </Box>
)

export default Main
