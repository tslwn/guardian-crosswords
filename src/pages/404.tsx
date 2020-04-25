/** @jsx jsx */
import React from 'react'
import { Styled, jsx } from 'theme-ui'

import Layout from '../components/layout'
import SEO from '../components/seo'

const NotFoundPage: React.FC = () => (
  <Layout>
    <SEO title="404" />
    <Styled.h1>404</Styled.h1>
  </Layout>
)

export default NotFoundPage
