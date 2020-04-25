/** @jsx jsx */
import React from 'react'
import { Styled, jsx } from 'theme-ui'

import Layout from '../components/layout'
import SEO from '../components/seo'

const AboutPage: React.FC = () => (
  <Layout>
    <SEO title="About" />
    <Styled.h1>About</Styled.h1>
  </Layout>
)

export default AboutPage
