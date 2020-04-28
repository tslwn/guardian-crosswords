/** @jsx jsx */
import React from 'react'
import { Styled, jsx, Box } from 'theme-ui'
import { Link } from 'gatsby'

const Footer: React.FC = () => (
  <Box as="footer" sx={{ bg: 'primary', color: 'white', p: 3, width: '100%' }}>
    <Styled.a
      as={Link}
      sx={{ color: 'white', ':visited': { color: 'secondary' } }}
      // @ts-ignore
      to="/"
    >
      Home
    </Styled.a>
  </Box>
)

export default Footer
