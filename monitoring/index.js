import Perf from './perf'
import Resource from './resouce'
import XhrHook from './xhrhook'
import ErrorCatch from './errCatch'



Perf.init((perfData) => {
  console.log('拦截到Perf数据：', perfData)
})

Resource.init((resouceData) => {
  console.log('拦截到Resouce数据：', resouceData)
})

XhrHook.init((data) => {
  console.log('拦截到ajax数据：', data)
})

ErrorCatch.init((errorData) => {
  console.log('拦截到error信息：', errorData)
})



export {
  Perf
}