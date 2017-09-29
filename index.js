const webpack = require("webpack")
const webpackConfig = require('./build/webpack.config.js')

webpackConfig(config => {
  webpack(config, (err, stats) => {
    if (err || stats.hasErrors()) {
      console.log(err)
      stats.compilation.errors.forEach(item => {
        console.log(item)
      })
    }
  })
})

