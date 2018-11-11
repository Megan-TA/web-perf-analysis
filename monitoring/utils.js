export default {
  onLoad (cb) {
    // 资源都加载完成
    if (document.readyState === 'complete') {
      cb()
      return
    }
    window.addEventListener('load', () => {
      cb()
    }, false)
  }
}