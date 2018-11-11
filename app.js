let Koa = require('koa')
let KoaStatic = require('koa-static')
let path = require('path')
let API = require('./server/middleaware/api.js')
let SourceMap = require('./server/middleaware/sourcemap')

let port = 3000
let app = new Koa()

app.use(API)
app.use(SourceMap)
app.use(KoaStatic(path.join(__dirname, '/public')))


app.listen(port, () => {
  console.log(`${port} 已启动`)
})
