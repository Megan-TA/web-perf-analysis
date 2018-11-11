(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.Mybundle = {})));
}(this, (function (exports) { 'use strict';

  let Utils = {
    getTimingData () {
      let {timing} = window.performance;
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
       
      };
      return data
    },
    domReady (callback) {
      let Timer = null;
      let check = () => {
        if (window.performance.timing.domInteractive) {
          clearTimeout(Timer);
          callback();
        } else {
          Timer = setTimeout(check, 100);
        }
      };
      if (document.readyState === 'interactive') {
        callback();
        return
      }
      document.addEventListener('DOMContentLoaded', () => {
        check();
      });
    },
    onLoad (callback) {
      let Timer = null;
      let check = () => {
        if (window.performance.timing.loadEventEnd) {
          clearTimeout(Timer);
          callback();
        } else {
          Timer = setTimeout(check, 100);
        }
      };
      if (document.readyState === 'complete') {
        callback();
        return
      }
      window.addEventListener('load', () => {
        check();
      });
    }
  };

  var Perf = {
    init (cb) {
      
      /**
       * 分domReady和onLoad两个方法是因为有可能资源未全部加载完成就关闭了浏览器窗口
       */

      Utils.domReady(() => {
        let perfData = Utils.getTimingData();
        perfData.type = 'domReady';
        cb(perfData);
      });
      Utils.onLoad(() => {
        let perfData = Utils.getTimingData();
        perfData.type = 'onLoad';
        cb(perfData);
      });
    }
  };

  var Utils$1 = {
    onLoad (cb) {
      // 资源都加载完成
      if (document.readyState === 'complete') {
        cb();
        return
      }
      window.addEventListener('load', () => {
        cb();
      }, false);
    }
  };

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

      };
      return data
    }
  };

  var Resource$1 = {
    init () {
      Utils$1.onLoad(() => {
        let entries = window.performance.getEntriesByType('resource');
        let filterEntries = entries.map(_ => Resource.getOneSourceData(_));
        return filterEntries
      });

    }
  };

  function fetchHook (cb) {
    if (window.fetch) {
      let _fetch = window.fetch;
      window.fetch = function () {
        let startTime = Date.now();
        let args = [].slice.call(arguments);
        let url = '';
        let method = 'GET';

        let fetchInput = args[0];
        if (typeof fetchInput === 'string') {
          url = args;
        } else
        if (fetchInput instanceof Request) {
          url = fetchInput.url;
          method = fetchInput.method || method;
        } else {
          url = '' + fetchInput;
        }

        let uploadData = {
          url, 
          method,
          status: 0,
          type: '',
          duration: 0
        };

        return _fetch.apply(this, args).then(response => {
          uploadData.status = response.status;
          uploadData.type = response.type;
          uploadData.duration = Date.now() - startTime;
          cb(uploadData);
          return response
        })
      };
    }
  }

  var XhrHook = {
    init (cb) {
      let xhr = window.XMLHttpRequest;
      if (xhr._web_perf_analysis) {
        return
      }
      xhr._web_perf_analysis = true;
      let _open = xhr.prototype.open;
      xhr.prototype.open = function (method, url, aysnc) {
        this._web_perf_analysis_info = {
          method, url, aysnc
        };
        return _open.apply(this, arguments)
      };
      let _send = xhr.prototype.send;
      xhr.prototype.send = function (value) {
        let start = Date.now();
        let fn = (type) => () => {
          this._web_perf_analysis_info.time = Date.now() - start;
          // TODO 处理value是数字 没有length情况
          this._web_perf_analysis_info.requestSize = value ? value.length : 0;
          this._web_perf_analysis_info.responseSize = this.responseText.length;
          this._web_perf_analysis_info.type = type;
          cb(this._web_perf_analysis_info);
        };
        this.addEventListener('load', fn('load'), false);
        this.addEventListener('error', fn('error'), false);
        this.addEventListener('abort', fn('abort'), false);
        return _send.apply(this, arguments)
      };

      fetchHook(cb);
    }
  };

  function formatError (error) {
  // 火狐/safis / chrome 对error信息处理不一致
    let column = error.column || error.columnNumber;
    let line = error.line || error.lineNumber;
    let errorType = error.name;
    let message = error.message;
    let stack = error.stack;
    
    let matchUrl = stack.match(/(http|https)?:\/\/[^\n]+/);
    let urlFirstStack = matchUrl ? matchUrl[0] : '';

    // 获取真正的url
    let regUrlCheck = /(https|http)?:\/\/(\S)*\.js/;
    let resourceUrl = '';
    if (regUrlCheck.test(urlFirstStack)) {
      resourceUrl = urlFirstStack.match(regUrlCheck)[0];
    }
    debugger



    debugger


    debugger
  }


  var ErrorCatch = {
    init (cb) {
      let _error = window.onerror;
      window.onerror = function (message, source, lineno, colno, error) {
        try {
          let errorData = formatError(error);
          _error.apply(this, arguments);
        } catch (err) {
          console.log(err);
        }
      };
    }
  };

  Perf.init((perfData) => {
    console.log('222222111');
  });

  Resource$1.init(() => {
    console.log('111');
  });

  XhrHook.init((data) => {
    console.log('拦截到ajax数据：', data);
  });

  ErrorCatch.init((data) => {
    console.log(data);
  });


  console.log(www);

  exports.Perf = Perf;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
