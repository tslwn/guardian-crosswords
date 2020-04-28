module.exports = {
  siteMetadata: {
    title: `Guardian crosswords`,
    description: `Gatsby app for solving the Guardian's crosswords`,
    author: `@tslwn`
  },
  plugins: [
    `gatsby-plugin-netlify-cache`,
    `gatsby-plugin-typegen`,
    `gatsby-plugin-typescript`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-theme-ui`,
    `gatsby-theme-style-guide`
  ]
}
