// TODO: reduce duplication in logging
const axios = require('axios')
const cheerio = require('cheerio')
const path = require('path')

require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

const colorReset = '\x1b[0m'
const colorFgBlue = '\x1b[34m'
const colorFgGreen = '\x1b[32m'
const colorFgRed = '\x1b[31m'

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

  const logFetch = (message, status) => {
    console.log(
      `${
        status === 200 ? `${colorFgGreen}success` : `${colorFgRed}failed`
      }${colorReset} fetch ${message}${status !== 200 ? ` - ${status}` : ``}`
    )
  }

  const logError = (message, error) => {
    if (error.response) {
      status = error.response.status
      console.log(
        `${colorFgRed}failed${colorReset} fetch ${message} - ${error.response.status}`
      )
    } else if (error.request) {
      console.log(
        `${colorFgRed}failed${colorReset} fetch ${message} - ${error.request}`
      )
    } else {
      console.log(
        `${colorFgRed}failed${colorReset} fetch ${message} - ${error.message}`
      )
    }
  }

  const fetchCrosswordIds = async series => {
    let page = 1
    let ids = []
    let status

    do {
      try {
        const siteUrl = `https://www.theguardian.com/crosswords/series/${series}?page=${page}`
        const response = await axios.get(siteUrl)

        status = response.status
        logFetch(`crosswords/series/${series}?page=${page}`, status)

        const $ = cheerio.load(response.data)

        // Limit number of items per page if environment variable set
        const pageIds = $(crosswordItemClasses.join(''))
          .filter(
            index =>
              index < process.env.CROSSWORD_ITEMS_PER_PAGE ||
              !process.env.CROSSWORD_ITEMS_PER_PAGE
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
              `${colorFgBlue}info${colorReset} ${series}/max ${highestNumberVisited} reached in cache`
            )
            break
          }
        }
        page++
      } catch (error) {
        logError(error)
      }
    } while (
      // Increment page until 404
      status !== 404 &&
      // Limit number of pages per series if environment variable set
      (page <= process.env.CROSSWORD_PAGES_PER_SERIES ||
        !process.env.CROSSWORD_PAGES_PER_SERIES)
    )

    return ids
  }

  const fetchCrosswordData = async id => {
    let status
    try {
      const siteUrl = `https://www.theguardian.com/${id}`
      const response = await axios.get(siteUrl)

      status = response.status
      logFetch(`${id}`, status)

      return JSON.parse(
        cheerio
          .load(response.data)('.js-crossword')
          .attr('data-crossword-data')
      )
    } catch (error) {
      logError(error)
    }
  }

  const fetchAndCacheCrosswordData = async id => {
    const [, series, number] = id.split('/')

    const valueFromCache = await cache.get(id)
    if (valueFromCache) {
      console.log(`${colorFgBlue}info${colorReset} ${id} retrieved from cache`)
      return valueFromCache
    } else {
      // Cache crossword data
      const value = await fetchCrosswordData(id)
      const valueToCache = await cache.set(id, value)
      console.log(`${colorFgBlue}info${colorReset} ${id} added to cache`)

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
          console.log(
            `${colorFgBlue}info${colorReset} ${series}/max updated to ${newMax}`
          )
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
        .filter(
          (series, index) =>
            // Limit number of series if environment variable set
            index < process.env.CROSSWORD_SERIES ||
            !process.env.CROSSWORD_SERIES
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

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === 'build-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /react-crossword/,
            use: loaders.null()
          }
        ]
      }
    })
  }
}
