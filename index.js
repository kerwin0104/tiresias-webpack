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

function execWebpack (webpackConfig) {
  webpack(webpackConfig, (err, stats) => {
    if (err || stats.hasErrors()) {
      console.log(err)
      stats.compilation.errors.forEach(item => {
        console.log(item)
      })
    }
  })
}

var tiresiasWebpack = function (config, callback) {
  config = Object.assign({}, baseConfig, config)
  getWebpackConfig(baseConfig, webpackConfig => {
    if (typeof callback === 'function') {
      var retConfig = callback(webpackConfig)
      if (typeof retConfig === 'object') {
        webpackConfig = retConfig
      }
    }
    execWebpack(webpackConfig)
  })
}

module.exports = tiresiasWebpack


