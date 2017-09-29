const getWebpackgeBaseConfig = require('../config/webpack.base.config.js')
const path = require('path')
const glob = require('glob')
const fs = require('fs')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

function buildConfig (baseConfig, callback) {
  const rootDir = baseConfig.rootDir
  const pageDir = path.join(rootDir, baseConfig.pageDir)
  const resourceDir = path.join(rootDir, baseConfig.resourceDir)
  const actionDir = path.join(rootDir, baseConfig.actionDir)
  const globPath = path.join(pageDir, './**/*.*')

  getWebpackgeBaseConfig(baseConfig, config => {
    const entry = config.entry || {}
    const plugins = config.plugins || []

    plugins.push(
      new CleanWebpackPlugin(['dist'], {
          root: rootDir, 　　  //  根目录
          verbose:  true,         　　　　　　　//  在控制台输出信息
          dry:      false         　　　　　　　//  只删除文件
        }
      )
    )

    var processPromise= []

    glob(globPath, (err, filePaths) => {
      filePaths.forEach(filePath => {
        let relativeFilePath = path.relative(pageDir, filePath)
        let pathInfo = path.parse(relativeFilePath)

        // console.log('pageDir:' + pageDir)
        // console.log('filePath:' + filePath)
        // console.log('relativeFilePath:' + relativeFilePath)
          
        processPromise.push(
          new Promise((resolve, reject) => {
            let scriptFile = path.join(
                resourceDir,
                path.dirname(relativeFilePath), 
                pathInfo.name, 
                './main.js'
            )

            // console.log(scriptFile)

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
          config.entry = entry
          config.plugins = plugins
          callback(config)
        })
    })
  })
}

module.exports = buildConfig
