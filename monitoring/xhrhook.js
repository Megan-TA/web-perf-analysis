function fetchHook (cb) {
  if (window.fetch) {
    let _fetch = window.fetch
    window.fetch = function () {
      let startTime = Date.now()
      let args = [].slice.call(arguments)
      let url = ''
      let method = 'GET'

      let fetchInput = args[0]
      if (typeof fetchInput === 'string') {
        url = args
      } else
      if (fetchInput instanceof Request) {
        url = fetchInput.url
        method = fetchInput.method || method
      } else {
        url = '' + fetchInput
      }

      let uploadData = {
        url, 
        method,
        status: 0,
        type: '',
        duration: 0
      }

      return _fetch.apply(this, args).then(response => {
        uploadData.status = response.status
        uploadData.type = response.type
        uploadData.duration = Date.now() - startTime
        cb(uploadData)
        return response
      })
    }
  }
}

export default {
  init (cb) {
    let xhr = window.XMLHttpRequest
    if (xhr._web_perf_analysis) {
      return
    }
    xhr._web_perf_analysis = true
    let _open = xhr.prototype.open
    xhr.prototype.open = function (method, url, aysnc) {
      this._web_perf_analysis_info = {
        method, url, aysnc
      }
      return _open.apply(this, arguments)
    }
    let _send = xhr.prototype.send
    xhr.prototype.send = function (value) {
      let start = Date.now()
      let fn = (type) => () => {
        this._web_perf_analysis_info.time = Date.now() - start
        // TODO 处理value是数字 没有length情况
        this._web_perf_analysis_info.requestSize = value ? value.length : 0
        this._web_perf_analysis_info.responseSize = this.responseText.length
        this._web_perf_analysis_info.type = type
        cb(this._web_perf_analysis_info)
      }
      this.addEventListener('load', fn('load'), false)
      this.addEventListener('error', fn('error'), false)
      this.addEventListener('abort', fn('abort'), false)
      return _send.apply(this, arguments)
    }

    fetchHook(cb)
  }
}