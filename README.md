# web-perf-analysis
封装的前端监控性能工具

performance.timing 一些api说明

| api | 描述 | 备注 |
| :-- | :-- | :--  |
| domloading | dom解析开始 | document.readyState = 'loading'
| domInteractive | dom解析结束 | document.readyState = 'interactive '
| domContentLoadedEventStart | 开始加载网络资源 | |
| domContentLoadedEventEnd | 网页内资源全部加载完成的时间 | |
| domComplete | 文档解析完成 | document.readyState = 'complete'
