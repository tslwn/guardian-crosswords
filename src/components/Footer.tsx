/** @jsx jsx */
import React from 'react'
import { Styled, jsx } from 'theme-ui'
import { Link } from 'gatsby'

const Footer: React.FC = () => (
  <footer sx={{ bg: 'primary', color: 'white', p: 3 }}>
    <Styled.a
      as={Link}
      sx={{ color: 'white', ':visited': { color: 'secondary' } }}
      // @ts-ignore
      to="/"
    >
      Home
    </Styled.a>
  </footer>
)

export default Footer
