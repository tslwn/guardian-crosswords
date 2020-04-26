/** @jsx jsx */
import React from 'react'
import { Styled, jsx } from 'theme-ui'
import { graphql } from 'gatsby'
import Crossword from 'react-crossword'

import Layout from '../components/layout'
import SEO from '../components/seo'

interface CrosswordPageProps {
  data: GatsbyTypes.CrosswordPageQuery
  pageContext: GatsbyTypes.CrosswordPageQueryVariables
}

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
      <Styled.h1>{name}</Styled.h1>
      {crosswordData ? <Crossword data={crosswordData} /> : <div>Oops!</div>}
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
