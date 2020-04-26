// TODO: improve logging
const axios = require('axios')
const cheerio = require('cheerio')
const path = require('path')

require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

exports.sourceNodes = async (
  { actions, cache, createNodeId, createContentDigest },
  configOptions
) => {
  const { createNode } = actions
  delete configOptions.plugins

  const crosswordSeries = [
    'quick',
    'cryptic',
    'prize',
    'weekend-crossword',
    'quiptic',
    'speedy',
    'everyman'
  ]

  const crosswordIdRegExp = /crosswords\/(quick|cryptic|prize|weekend|quiptic|speedy|everyman)\/\d+/

  const crosswordItemClasses = [
    '.fc-item',
    '.fc-item--has-metadata',
    '.fc-item--has-timestamp',
    '.fc-item--pillar-lifestyle',
    '.fc-item--type-article',
    '.js-fc-item',
    '.js-snappable'
  ]

  const fetchCrosswordIds = async series => {
    let page = 1
    let ids = []
    let status

    do {
      try {
        const siteUrl = `https://www.theguardian.com/crosswords/series/${series}?page=${page}`
        console.log(siteUrl)

        const response = await axios.get(siteUrl)
        const $ = cheerio.load(response.data)

        // Limit number of items per page if environment variable set
        const pageIds = $(crosswordItemClasses.join(''))
          .filter(index =>
            process.env.NODE_ENV === 'development'
              ? index < process.env.CROSSWORD_ITEMS_PER_PAGE ||
                !process.env.CROSSWORD_ITEMS_PER_PAGE
              : true
          )
          .map((index, element) => $(element).attr('data-id'))
          // Exclude puzzles that can't be shown in the interactive format
          .filter((index, element) => crosswordIdRegExp.test(element))
          .toArray()

        ids = [...ids, ...pageIds]

        // If build is not limited by environment variables, break if page already visited
        if (
          !process.env.CROSSWORD_SERIES &&
          !process.env.CROSSWORD_PAGES_PER_SERIES &&
          !process.env.CROSSWORD_ITEMS_PER_PAGE
        ) {
          const highestNumberVisited = await cache.get(`${series}/max`)
          if (pageIds.includes(highestNumberVisited)) {
            console.log(
              `${series}/max ${highestNumberVisited} reached in cache`
            )
            break
          }
        }
        page++
      } catch (error) {
        if (error.response) {
          status = error.response.status
          // console.log(error.response.data)
          console.log(error.response.status)
          // console.log(error.response.headers)
        } else if (error.request) {
          console.log(error.request)
        } else {
          console.log(error.message)
        }
      }
    } while (
      // Increment page until 404
      status !== 404 &&
      // Limit number of pages per series if environment variable set
      (process.env.NODE_ENV === 'development'
        ? page <= process.env.CROSSWORD_PAGES_PER_SERIES ||
          !process.env.CROSSWORD_PAGES_PER_SERIES
        : true)
    )

    return ids
  }

  const fetchCrosswordData = async id => {
    try {
      const siteUrl = `https://www.theguardian.com/${id}`
      console.log(siteUrl)

      const response = await axios.get(siteUrl)
      return JSON.parse(
        cheerio
          .load(response.data)('.js-crossword')
          .attr('data-crossword-data')
      )
    } catch (error) {
      if (error.response) {
        // console.log(error.response.data)
        console.log(error.response.status)
        // console.log(error.response.headers)
      } else if (error.request) {
        console.log(error.request)
      } else {
        console.log(error.message)
      }
    }
  }

  const fetchAndCacheCrosswordData = async id => {
    const [, series, number] = id.split('/')

    const valueFromCache = await cache.get(id)
    if (valueFromCache) {
      console.log(`${id} retrieved from cache`)
      return valueFromCache
    } else {
      // Cache crossword data
      const value = await fetchCrosswordData(id)
      const valueToCache = await cache.set(id, value)
      console.log(`${id} added to cache`)

      // If build is not limited by environment variables, update highest number
      // visited for series
      if (
        !process.env.CROSSWORD_SERIES &&
        !process.env.CROSSWORD_PAGES_PER_SERIES &&
        !process.env.CROSSWORD_ITEMS_PER_PAGE
      ) {
        const previousMax = await cache.get(`${series}/max`)
        if (previousMax === undefined || number > previousMax) {
          const newMax = await cache.set(`${series}/max`, number)
          console.log(`${series}/max updated to ${newMax}`)
        }
      }

      return valueToCache
    }
  }

  const processCrossword = crossword => {
    // GraphQL requires known fields, deserialize on the client for now
    crossword.entries.forEach(
      entry =>
        (entry.separatorLocations = JSON.stringify(entry.separatorLocations))
    )

    const nodeId = createNodeId(crossword.id)
    const nodeContent = JSON.stringify(crossword)
    const nodeData = Object.assign({}, crossword, {
      id: nodeId,
      parent: null,
      children: [],
      internal: {
        type: `GuardianCrossword`,
        content: nodeContent,
        contentDigest: createContentDigest(crossword)
      },
      // use original ID as slug
      slug: crossword.id
    })
    return nodeData
  }

  // TODO: "paralellise" better?
  const crosswordIds = (
    await Promise.all(
      crosswordSeries
        .filter((series, index) =>
          // Limit number of series if environment variable set
          process.env.NODE_ENV === 'development'
            ? index < process.env.CROSSWORD_SERIES ||
              !process.env.CROSSWORD_SERIES
            : true
        )
        .map(series => fetchCrosswordIds(series))
    )
  ).flat()

  const crosswordData = await Promise.all(
    crosswordIds.map(id => fetchAndCacheCrosswordData(id))
  )

  crosswordData.forEach(crossword => {
    createNode(processCrossword(crossword))
  })
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    query {
      allGuardianCrossword {
        edges {
          node {
            slug
          }
        }
      }
    }
  `)

  result.data.allGuardianCrossword.edges.forEach(({ node }) => {
    createPage({
      path: node.slug,
      component: path.resolve('./src/templates/CrosswordTemplate.tsx'),
      context: {
        slug: node.slug
      }
    })
  })
}
