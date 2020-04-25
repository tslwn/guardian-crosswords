const { hot } = require("react-hot-loader/root")

// prefer default export if available
const preferDefault = m => m && m.default || m


exports.components = {
  "component---node-modules-gatsby-theme-style-guide-src-template-js": hot(preferDefault(require("C:\\Users\\timlawson\\projects\\guardian-crosswords\\node_modules\\gatsby-theme-style-guide\\src\\template.js"))),
  "component---cache-dev-404-page-js": hot(preferDefault(require("C:\\Users\\timlawson\\projects\\guardian-crosswords\\.cache\\dev-404-page.js"))),
  "component---src-pages-404-tsx": hot(preferDefault(require("C:\\Users\\timlawson\\projects\\guardian-crosswords\\src\\pages\\404.tsx"))),
  "component---src-pages-index-tsx": hot(preferDefault(require("C:\\Users\\timlawson\\projects\\guardian-crosswords\\src\\pages\\index.tsx"))),
  "component---src-pages-about-tsx": hot(preferDefault(require("C:\\Users\\timlawson\\projects\\guardian-crosswords\\src\\pages\\about.tsx")))
}

