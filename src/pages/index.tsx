/** @jsx jsx */
import React from 'react'
import { Styled, jsx, Box } from 'theme-ui'
import { graphql, Link } from 'gatsby'

import Layout from '../components/Layout'
import SEO from '../components/SEO'

interface IndexPageProps {
  data: GatsbyTypes.IndexPageQuery
  pageContext: GatsbyTypes.IndexPageQueryVariables
}

const IndexPage: React.FC<IndexPageProps> = ({ data }) => {
  const crosswords = data?.allGuardianCrossword.edges
  console.log(crosswords)
  return (
    <Layout>
      <SEO title="Home" />
      <Styled.h1>Guardian crosswords</Styled.h1>
      <Box>
        {crosswords.map(edge => {
          const { id, crosswordType, name, number } = edge.node
          return (
            <Box key={id} py={2}>
              <Link to={`/crosswords/${crosswordType}/${number}`}>{name}</Link>
            </Box>
          )
        })}
      </Box>
    </Layout>
  )
}

export default IndexPage

export const query = graphql`
  query IndexPage {
    allGuardianCrossword(
      sort: { order: [ASC, DESC], fields: [crosswordType, number] }
    ) {
      edges {
        node {
          id
          date
          crosswordType
          name
          number
        }
      }
    }
  }
`
