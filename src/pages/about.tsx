/** @jsx jsx */
import React from 'react'
import { jsx, Heading } from 'theme-ui'

import Layout from '../components/Layout'
import SEO from '../components/SEO'

const AboutPage: React.FC = () => (
  <Layout>
    <SEO title="About" />
    <header>
      <Heading as="h1">About</Heading>
    </header>
  </Layout>
)

export default AboutPage
