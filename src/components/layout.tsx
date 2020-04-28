/** @jsx jsx */
import { ThemeProvider, Styled, jsx } from 'theme-ui'
import React from 'react'
import 'normalize.css'

import theme from '../gatsby-plugin-theme-ui'

const Layout: React.FC = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <Styled.root
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh'
        }}
      >
        {children}
      </Styled.root>
    </ThemeProvider>
  )
}

export default Layout
