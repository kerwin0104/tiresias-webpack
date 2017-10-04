const getWebpackgeBaseConfig = require('../config/webpack.base.config.js')
const path = require('path')
const glob = require('glob')
const fs = require('fs')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

function buildConfig (baseConfig, callback) {
  const rootDir = baseConfig.rootDir
  const pageDir = path.join(rootDir, baseConfig.pageDir)
  const resourceDir = path.join(rootDir, baseConfig.resourceDir)
  const actionDir = path.join(rootDir, baseConfig.actionDir)
  const staticDir = path.join(rootDir, baseConfig.staticDir)
  const globPath = path.join(pageDir, './**/*.*')

  getWebpackgeBaseConfig(baseConfig, config => {
    const entry = config.entry || {}
    const plugins = config.plugins || []

    // clean dist dirctory
    plugins.push(
      new CleanWebpackPlugin(['dist'], {
          root: rootDir, 　　  //  根目录
          verbose:  true,         　　　　　　　//  在控制台输出信息
          dry:      false         　　　　　　　//  只删除文件
        }
      )
    )

    // copy actions and static
    plugins.push(
      new CopyWebpackPlugin([
        {
          context: actionDir,
          from: '**/*',
          to: path.join(rootDir, baseConfig.distDir, 'controllers')
        },
        {
          context: staticDir,
          from: '**/*',
          to: path.join(rootDir, baseConfig.distDir, 'static')
        }
      ])
    )

    var processPromise= []

    glob(globPath, (err, filePaths) => {
      filePaths.forEach(filePath => {
        let relativeFilePath = path.relative(pageDir, filePath)
        let pathInfo = path.parse(relativeFilePath)

        processPromise.push(
          new Promise((resolve, reject) => {
            let scriptFile = path.join(
                resourceDir,
                path.dirname(relativeFilePath), 
                './main.js'
            )

            fs.stat(scriptFile, (err, stat) => {
              // add to entry
              if (err) {
                console.warn(`scripts: [${scriptFile }] not found`)
              } else {
                entry[pathInfo.name] = scriptFile 
              }

              // add to plugins
              plugins.push(
                new HtmlWebpackPlugin({
                  inject: err ? false : true,
                  chunks: err ? [] : [pathInfo.name],
                  filename: path.join(
                      pathInfo.ext === '.html' ? 'htmls' : 'templates',
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
