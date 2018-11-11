function formatError (error) {
  // 火狐/safis / chrome 对error信息处理不一致
  let column = error.column || error.columnNumber
  let line = error.line || error.lineNumber
  let errorType = error.name
  let message = error.message
  let stack = error.stack
  
  let matchUrl = stack.match(/(http|https)?:\/\/[^\n]+/)
  let urlFirstStack = matchUrl ? matchUrl[0] : ''

  // 获取真实url信息
  let regUrlCheck = /(https|http)?:\/\/(\S)*\.js/
  let resourceUrl = ''
  if (regUrlCheck.test(urlFirstStack)) {
    resourceUrl = urlFirstStack.match(regUrlCheck)[0]
  }

  let _stackLine = ''
  let _stackCol = ''
  // http://localhost:3000/bundle.js:303:15
  // 兼容chrome没有col,line等信息
  let posStack = urlFirstStack.match(/:(\d+):(\d+)/)
  if (posStack && posStack.length >= 3) {
    [,_stackLine, _stackCol] = posStack
  }

  return {
    row: Number(column || _stackLine) ,
    col: Number(line || _stackCol),
    errorType,
    message,
    resourceUrl
  }
}


export default {
  init (cb) {
    let _error = window.onerror
    window.onerror = function (message, source, lineno, colno, error) {
      try {
        let errorData = formatError(error)
        errorData._message = message
        errorData._source = source
        errorData._col = colno
        errorData._row = lineno
        cb(errorData)
        _error.apply(this, arguments)
      } catch (err) {
        console.log(err)
      }
    }
  }
}