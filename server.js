const path = require('path')
const express = require('express')
const server = express()
const renderer = require('vue-server-renderer').createRenderer({  
  template: require('fs').readFileSync('./index.template.html', 'utf-8')
})

const createApp = require('./dist/bundle.server.js').default

// 将 dist 文件夹设置为静态文件服务器
server.use(express.static(path.join(__dirname, 'dist')))

server.get('*', (req, res) => {
  const context = { url: req.url }
  createApp(context).then(app => {
    renderer.renderToString(app, context, (err, html) => {
      if (err) {
        if (err.code === 404) {
          res.status(404).end('Page not found')
        } else {
          res.status(500).end('Internal Server Error')
        }
      } else {
        res.end(html)
      }
    })
  })
})

server.listen(8080, () => {
  console.log('server is listening in 8080');
})