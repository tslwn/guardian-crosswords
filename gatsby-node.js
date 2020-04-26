// TODO: improve logging
const axios = require('axios')
const cheerio = require('cheerio')

// TODO: remove limit on series
const crosswordSeries = [
  'quick'
  // 'cryptic'
  // 'prize',
  // 'weekend-crossword',
  // 'quiptic',
  // 'speedy',
  // 'everyman'
]

const crosswordItemClasses = [
  '.fc-item',
  '.fc-item--has-image',
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

  // Increment page until 404
  do {
    try {
      const siteUrl = `https://www.theguardian.com/crosswords/series/${series}?page=${page}`
      console.log(siteUrl)

      const response = await axios.get(siteUrl)
      const $ = cheerio.load(response.data)
      ids = [
        ...ids,
        ...$(crosswordItemClasses.join(''))
          // TODO: remove limit on items per page
          .filter(index => index <= 0)
          .map((index, element) => $(element).attr('data-id'))
          .toArray()
      ]
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
    // TODO: remove limit on pages per series
  } while (status !== 404 && page <= 1)

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

// TODO: caching!
exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest },
  configOptions
) => {
  const { createNode } = actions
  delete configOptions.plugins

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
      }
    })
    return nodeData
  }

  // TODO: "paralellise" better?
  const crosswordIds = (
    await Promise.all(crosswordSeries.map(series => fetchCrosswordIds(series)))
  ).flat()

  const crosswordData = await Promise.all(
    crosswordIds.map(id => fetchCrosswordData(id))
  )

  crosswordData.forEach(crossword => {
    createNode(processCrossword(crossword))
  })
}
