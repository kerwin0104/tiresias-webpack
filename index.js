const webpack = require("webpack")
const getWebpackConfig = require('./build/webpack.config.js')

const baseConfig = {
  rootDir: __dirname,
  pageDir: 'src/pages',
  resourceDir: 'src/resources',
  staticDir: 'src/static',
  actionDir: 'src/actions',
  distDir: 'dist'
}

getWebpackConfig(baseConfig, webpackConfig => {
  webpack(webpackConfig, (err, stats) => {
    if (err || stats.hasErrors()) {
      console.log(err)
      stats.compilation.errors.forEach(item => {
        console.log(item)
      })
    }
  })
})

