/** @jsx jsx */
import React from 'react'
import { jsx, Spinner } from 'theme-ui'
import { graphql } from 'gatsby'
import Loadable from 'react-loadable'

import Footer from '../components/Footer'
import Header from '../components/Header'
import Layout from '../components/Layout'
import SEO from '../components/SEO'

interface CrosswordPageProps {
  data: GatsbyTypes.CrosswordPageQuery
  pageContext: GatsbyTypes.CrosswordPageQueryVariables
}

// TODO: handle SSR better...
const LoadableCrossword: any = Loadable({
  loader: () => import('react-crossword'),
  loading: () => <Spinner />
})

// TODO: handle 'possibly undefined better'
const CrosswordTemplate: React.FC<CrosswordPageProps> = ({ data }) => {
  const crosswordData = data?.guardianCrossword
  if (crosswordData) {
    if (crosswordData.entries) {
      crosswordData.entries.forEach(
        (entry: any) =>
          (entry.separatorLocations = JSON.parse(entry?.separatorLocations))
      )
    }
  }
  const name = data?.guardianCrossword?.name || ''

  return (
    <Layout>
      <SEO title={name} />
      <Header title={name} />
      <main sx={{ px: 3 }}>
        {crosswordData ? (
          <LoadableCrossword data={crosswordData} id={crosswordData.id} />
        ) : (
          `Crossword not found`
        )}
      </main>
      <Footer />
    </Layout>
  )
}

export default CrosswordTemplate

export const query = graphql`
  query CrosswordPage($slug: String!) {
    guardianCrossword(slug: { eq: $slug }) {
      id
      crosswordType
      date
      dateSolutionAvailable
      name
      number
      pdf
      solutionAvailable
      dimensions {
        cols
        rows
      }
      entries {
        clue
        direction
        group
        humanNumber
        id
        length
        number
        position {
          x
          y
        }
        separatorLocations
        solution
      }
    }
  }
`
