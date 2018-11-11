import Perf from './perf'
import Resource from './resouce'
import XhrHook from './xhrhook'
import ErrorCatch from './errCatch'



Perf.init((perfData) => {
  console.log('222222111')
})

Resource.init(() => {
  console.log('111')
})

XhrHook.init((data) => {
  console.log('拦截到ajax数据：', data)
})

ErrorCatch.init((data) => {
  console.log(data)
})


console.log(www)

export {
  Perf
}