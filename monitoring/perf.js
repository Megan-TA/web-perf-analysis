let Utils = {
  getTimingData () {
    let {timing} = window.performance
    let data = {
      // 网络建立连接
      // 上一个页面卸载总耗时
      prevPage: timing.fetchStart - timing.navigationStart,
      // 上一个页面卸载
      prevUnload: timing.unloadEventEnd - timing.unloadEventStart,
      // 重定向
      redirect: timing.redirectEnd - timing.redirectStart,
      // DNS
      dns: timing.domainLookupEnd - timing.domainLookupStart,
      tcp: timing.connectEnd - timing.connectStart,
      // 网络总耗时
      network: timing.connectEnd - timing.navigationStart,
  
  
      // 网络接收数据
      // 前端从发送请求到接收请求的时间
      send: timing.responseStart - timing.requestStart,
      // 接收数据用时
      receive: timing.responseEnd - timing.responseStart,
      // 请求页面总耗时
      request: timing.responseEnd - timing.requestStart,
  
      // 前端渲染
      // dom解析时间
      dom: timing.domComplete - timing.domLoading,
      // onload时间 
      onload: timing.loadEventEnd - timing.loadEventStart,
      // 前端总时间
      frontend: timing.loadEventEnd - timing.domLoading,
  
      // 关键阶段
      // 页面完全加载的时间
      load: timing.loadEventEnd - timing.navigationStart, 
      // dom准备时间
      domReady: timing.domContentLoadedEventStart - timing.navigationStart,
      // 可操作时间
      domIteractive: timing.domInteractive - timing.navigationStart,
      // 首字节时间
      ttfb: timing.responseStart - timing.navigationStart,
  
  
  
      // 白屏
      // whiteScreen: timing.responseStart - timing.navigationStart,
     
    }
    return data
  },
  domReady (callback) {
    let Timer = null
    let check = () => {
      if (window.performance.timing.domInteractive) {
        clearTimeout(Timer)
        callback()
      } else {
        Timer = setTimeout(check, 100)
      }
    }
    if (document.readyState === 'interactive') {
      callback()
      return
    }
    document.addEventListener('DOMContentLoaded', () => {
      check()
    })
  },
  onLoad (callback) {
    let Timer = null
    let check = () => {
      if (window.performance.timing.loadEventEnd) {
        clearTimeout(Timer)
        callback()
      } else {
        Timer = setTimeout(check, 100)
      }
    }
    if (document.readyState === 'complete') {
      callback()
      return
    }
    window.addEventListener('load', () => {
      check()
    })
  }
}

export default {
  init (cb) {
    
    /**
     * 分domReady和onLoad两个方法是因为有可能资源未全部加载完成就关闭了浏览器窗口
     */

    Utils.domReady(() => {
      let perfData = Utils.getTimingData()
      perfData.type = 'domReady'
      cb(perfData)
    })
    Utils.onLoad(() => {
      let perfData = Utils.getTimingData()
      perfData.type = 'onLoad'
      cb(perfData)
    })
  }
}