/** @jsx jsx */
import React from 'react'
import { jsx } from 'theme-ui'

import Footer from '../components/Footer'
import Header from '../components/Header'
import Layout from '../components/Layout'
import Main from '../components/Main'
import SEO from '../components/SEO'

const NotFoundPage: React.FC = () => (
  <Layout>
    <SEO title="404" />
    <Header title="404" />
    <Main />
    <Footer />
  </Layout>
)

export default NotFoundPage
