/** @jsx jsx */
import React from 'react'
import { jsx, Heading } from 'theme-ui'

import Layout from '../components/Layout'
import SEO from '../components/SEO'

const NotFoundPage: React.FC = () => (
  <Layout>
    <SEO title="404" />
    <header>
      <Heading as="h1">404</Heading>
    </header>
  </Layout>
)

export default NotFoundPage
