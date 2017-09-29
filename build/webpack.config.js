const getBaseConfig = require('../config/webpack.base.config.js')
const path = require('path')
const glob = require('glob')
const fs = require('fs')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const globPath = path.join(__dirname, '../src/pages/**/*.*')
const pageRootPath = path.join(__dirname, '../src/pages/')

plugins.push(
  new CleanWebpackPlugin(['dist'], {
          root: path.join(__dirname, '..'), 　　//  根目录
          verbose:  true,         　　　　　　　//  在控制台输出信息
          dry:      false         　　　　　　　//  只删除文件
      }
  )
)

function buildConfig (callback) {
  getBaseConfig(config => {
    const plugins = config.plugins || []
    const entry = config.entry || {}
    var processPromise= []

    glob(globPath, (err, filePaths) => {
      filePaths.forEach(filePath => {
        let relativeFilePath = path.relative(pageRootPath, filePath)
        let pathInfo = path.parse(relativeFilePath)
          
        processPromise.push(
          new Promise((resolve, reject) => {
            let scriptFile = path.join(
                __dirname,
                '../src/scripts',
                path.dirname(relativeFilePath), pathInfo.name + '.js'
            )
            fs.stat(scriptFile, (err, stat) => {
              // add to entry
              if (!err) {
                entry[pathInfo.name] = scriptFile 
              }

              // add to file
              plugins.push(
                new HtmlWebpackPlugin({
                  inject: err ? false : true,
                  chunks: err ? [] : [pathInfo.name],
                  filename: path.join(
                      pathInfo.ext === '.html' ? 'static' : 'views',
                      relativeFilePath
                  ),
                  template: filePath,
                })
              )
              resolve()
            })
            
          })
        )

      })

      Promise.all(processPromise)
        .then(() => {
          callback(config)
        })
    })
  })
}

module.exports = buildConfig
