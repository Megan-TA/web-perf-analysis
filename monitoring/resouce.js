import Utils from './utils'

let Resource = {
  getOneSourceData (r) {
    let data = {
      duration: parseInt(r.duration),
      name: r.name,
      initiatorType: r.initiatorType,

      // 连接过程
      redirect: r.redirectEnd - r.redirectStart,
      dns: r.domainLookupEnd - r.domainLookupStart,
      tcp: r.connectEnd - r.connectStart,
      network: r.connectEnd - r.startTime,

      // 接收过程
      send: r.responseStart - r.requestStart,
      // 接收数据用时
      receive: r.responseEnd - r.responseStart,
      // 请求页面总耗时
      request: r.responseEnd - r.requestStart,

      // 关键数据
      ttfb: r.responseStart - r.requestStart

    }
    return data
  }
}

export default {
  init () {
    Utils.onLoad(() => {
      let entries = window.performance.getEntriesByType('resource')
      let filterEntries = entries.map(_ => Resource.getOneSourceData(_))
      return filterEntries
    })

  }
}