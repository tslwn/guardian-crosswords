module.exports = {
  siteMetadata: {
    title: `Guardian crosswords`,
    description: `Gatsby app for solving the Guardian's crosswords`,
    author: `@tslwn`
  },
  plugins: [
    `gatsby-plugin-netlify-cache`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-theme-ui`,
    `gatsby-plugin-typegen`,
    `gatsby-plugin-typescript`,
    {
      resolve: `gatsby-plugin-webfonts`,
      options: {
        google: [
          {
            family: `Roboto`,
            variants: [`400`, `700`]
          },
          {
            family: `Roboto Slab`,
            variants: [`400`, `700`]
          }
        ]
      }
    },
    `gatsby-theme-style-guide`
  ]
}
