const SourceMap = require('source-map')
const fs = require('fs')
const path = require('path')

let SourceMapPath = path.join(__dirname, '../../public/my-app/build/static/js/main.6f90706e.chunk.js.map')

let sourceFileMap = {}
let fixPath = (filePath) => {
    return filePath.replace(/\.[\.\/]+/, '')
}

module.exports = async (ctx, next) => {
    // row: 1 column: 430
    if (ctx.path == '/sourceMap') {
        let sourceMapInfo = fs.readFileSync(SourceMapPath, 'utf-8')
        // 原始sourcemap结构
        let fileObj = JSON.parse(sourceMapInfo)

        let {sources} = fileObj
        // 去掉webpack的引用路径 比如 webpack: ../xxxx
        sources.forEach(item => {
            sourceFileMap[fixPath(item)] = item
        })

        let line = 1
        let column = 430

        // sourcemap的api 输出原始代码路径信息
        let consumer = await new SourceMap.SourceMapConsumer(sourceMapInfo)
        let result = consumer.originalPositionFor({line, column})

        // 原始代码名称
        let originSource = sourceFileMap[result.source]
        // 从sourceMap的sourcesContent属性数组中根据下标取出对应的代码
        let sourceContent = fileObj.sourcesContent[sources.indexOf(originSource)]
        // 替换掉原来压缩的代码中换行符
        sourceContent = sourceContent.split('\n')


        ctx.body = { originSource, result, sourceContent, fileObj}
    }
    return next()
}