function formatError (error) {
// 火狐/safis / chrome 对error信息处理不一致
  let column = error.column || error.columnNumber
  let line = error.line || error.lineNumber
  let errorType = error.name
  let message = error.message
  let stack = error.stack
  
  let matchUrl = stack.match(/(http|https)?:\/\/[^\n]+/)
  let urlFirstStack = matchUrl ? matchUrl[0] : ''

  // 获取真正的url
  let regUrlCheck = /(https|http)?:\/\/(\S)*\.js/
  let resourceUrl = ''
  if (regUrlCheck.test(urlFirstStack)) {
    resourceUrl = urlFirstStack.match(regUrlCheck)[0]
  }
  debugger



  debugger


  debugger
}


export default {
  init (cb) {
    let _error = window.onerror
    window.onerror = function (message, source, lineno, colno, error) {
      try {
        let errorData = formatError(error)
        _error.apply(this, arguments)
      } catch (err) {
        console.log(err)
      }
    }
  }
}