/** @jsx jsx */
import React from 'react'
import { Styled, jsx, Box, Grid, Heading } from 'theme-ui'
import { graphql, Link } from 'gatsby'

import { CrosswordType, crosswordTypes } from '../models/crossword'
import Layout from '../components/Layout'
import SEO from '../components/SEO'

interface IndexPageProps {
  data: GatsbyTypes.IndexPageQuery
  pageContext: GatsbyTypes.IndexPageQueryVariables
}

interface TypeListProps {
  data: GatsbyTypes.IndexPageQuery
  type: CrosswordType
}

const formatDate = (date: number) =>
  new Date(date)
    .toLocaleString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    })
    .replace(',', '')

const TypeList: React.FC<TypeListProps> = ({ data, type }) => (
  <Box as="section" id={type}>
    <Heading as="h2">{type}</Heading>
    <Styled.ul>
      {data?.allGuardianCrossword.edges
        .filter(edge => edge.node.crosswordType === type)
        .map(edge => {
          const { id, date, number, slug } = edge.node
          return (
            <Box as="li" key={id} py={1}>
              <Styled.a
                as={Link}
                // @ts-ignore
                to={`/${slug}`}
              >{`No ${number} ${date ? formatDate(date) : ''}`}</Styled.a>
            </Box>
          )
        })}
    </Styled.ul>
  </Box>
)

const IndexPage: React.FC<IndexPageProps> = ({ data }) => (
  <Layout>
    <SEO title="Home" />
    <header>
      <Heading as="h1">Guardian crosswords</Heading>
    </header>
    <main>
      <Grid gap={2} columns={[1, 2, null, 4]}>
        {crosswordTypes.map(type => (
          <TypeList data={data} type={type} />
        ))}
      </Grid>
    </main>
  </Layout>
)

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
          slug
        }
      }
    }
  }
`
