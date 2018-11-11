module.exports = async (ctx, next) => {
  let apiMap = {
    '/api/list': [
      {
        name: '苹果',
        describe: '很好吃',
        id: 0
      },
      {
        name: '香蕉',
        describe: '好吃',
        id: 1
      }
    ]
  }
  for (let key in apiMap) {
    if (ctx.path.includes(key)) {
      ctx.body = apiMap[key]
    }
  }
  return next()
}