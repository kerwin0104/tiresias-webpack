const webpack = require("webpack")
const getWebpackConfig = require('./build/webpack.config.js')
const path = require('path')

const baseConfig = {
  rootDir: __dirname,
  pageDir: 'src/pages',
  resourceDir: 'src/resources',
  staticDir: 'src/static',
  actionDir: 'src/actions',
  distDir: path.join(__dirname, 'dist')
}

function execWebpack (webpackConfig) {
  return webpack(webpackConfig, (err, stats) => {
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n')
  })
}

var tiresiasWebpack = function (config, callback, endCallback) {
  config = Object.assign({}, baseConfig, config)
  getWebpackConfig(config, webpackConfig => {
    if (typeof callback === 'function') {
      var retConfig = callback(webpackConfig)
      if (typeof retConfig === 'object') {
        webpackConfig = retConfig
      }
    }
    var compiler = execWebpack(webpackConfig)
    if (typeof endCallback === 'function') {
      endCallback(compiler)
    }
  })
}

tiresiasWebpack.exec = execWebpack

module.exports = tiresiasWebpack

