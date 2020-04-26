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
    {
      resolve: `gatsby-plugin-webfonts`,
      options: {
        fonts: {
          google: [
            {
              family: `Roboto`,
              variants: [`400`]
            }
          ]
        }
      }
    },
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-theme-ui`,
    `gatsby-theme-style-guide`
  ]
}
