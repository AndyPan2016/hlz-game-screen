<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
// 引入自定义模块加载
// require('@/configs/module')
// axios请求拦截和自定义Vue属性
require('@/services/axios.service')

export default {
  name: 'App',
  components: {},
  created () {
    // http请求服务集合对象
    window.apiService = {}
    // http请求响应拦截自定义(全局)函数
    window.responseIntercept = (response) => {
      // console.info(response)
      let that = this
      // 模拟一个异步，不影响正常的响应速度
      // setTimeout(function () {
      // 响应data
      let data = response.data
      // 当前请求url
      let configUrl = response.config.url || ''
      // 当前接口的服务名称key，以作为缓存key
      let urlSplit = configUrl.split('/')
      let key = urlSplit[urlSplit.length - 1].split('?')[0]
      key = (key || '').replace('.do', '')
      if (key || apiService) {
        let serviceItem = apiService[key]
        if (serviceItem) {
          // 如果指定字段缓存
          let serviceSync = serviceItem.sync
          let serviceStorage = serviceItem.storage
          if (serviceSync || serviceStorage) {
            // 遍历需要缓存的key及数据，并缓存
            let eachSyncKey = function (eachObject, eachData, storage) {
              let object
              let data
              for (let key in eachObject) {
                object = eachObject[key]
                data = eachData[key]
                if (object) {
                  if (typeof (object) === 'string') {
                    // 缓存数据
                    if (storage) {
                      that.setLocalStorage(object, JSON.stringify(data))
                    } else {
                      that.setCookie(object, data)
                    }
                  } else {
                    // 继续遍历
                    eachSyncKey(object, data, storage)
                  }
                }
              }
            }
            if (serviceSync) {
              eachSyncKey(serviceSync, data)
            }
            if (serviceStorage) {
              eachSyncKey(serviceStorage, data, true)
            }
          }
          // 如果需要vuex store缓存
          if (serviceItem.vxStore) {
            // 缓存响应的数据
            let responseStoreObject = {}
            responseStoreObject[key] = data
            that.$store.dispatch('responseStoreUpdate', responseStoreObject)
          }
        }
      }
      // }, 90)
    }
    let that = this
    window.requestIntercept = () => {
      that.$store.dispatch('processStatusStoreUpdate', {
        // 标题
        title: '错误',
        // 状态
        status: 'fail',
        // 结果
        result: '您还未登录',
        // 备注
        remark: '请先登录后再访问',
        // 按钮
        buttons: false
        // [
        //   {
        //     text: '完成',
        //     class: null,
        //     fn: () => {
        //       // 返回首页
        //       that.routeTo(PagesWallet.router(PagesWallet.index))
        //     }
        //   }
        // ]
      })
      // 去公共流程状态页
      that.routeTo(PagesCommons.router(PagesCommons.processStatus))
    }
  },
  mounted () {}
}
</script>

<style>
@import './assets/less/commons/_normalize.less';
@import './assets/fonts/fonts.less';

#app {
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  width: 750px;
  margin: 0 auto;
}
</style>
