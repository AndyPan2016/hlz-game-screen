
import Vue from 'vue'
import Axios from 'axios'
// import qs from 'qs'
// let { APIHOST } = Configs.require()
let { APIHOST, STATUS } = Configs.require()
let { thatUtils } = Utils.require()

// Axios.defaults.withCredentials = true
// 请求拦截
Axios.interceptors.request.use(config => {
  // let userNo = utils.getCookie(STATUS.USERNO)
  // if (!userNo) {
  //   if (window.requestIntercept) {
  //     window.requestIntercept()
  //     return
  //   }
  // }
  // config.withCredentials = true
  // config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  // 请求开始
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截
Axios.interceptors.response.use(response => {
  // 响应开始
  // console.info(response)
  // if (response.status === 200) {
  //   if (!response.data.success) {
  //     // throw new Error(response.data.message)
  //     return Promise.reject(response.data)
  //   }
  // }
  if (response.status === 200 && (response.data || {}).success) {
    if (window.responseIntercept) {
      window.responseIntercept(response)
    }
  }
  // console
  return response
}, error => {
  return Promise.reject(error)
})

// Axios.defaults.withCredentials = true

let customApi = {
  /**
   * GET
   * @param {String} path 接口地址
   * @param {Object} params 接口参数
   * @returns Promise对象
   */
  get: (path, params, header) => {
    path = APIHOST + path
    return new Promise((resolve, reject) => {
      Axios.get(path, params, header).then(res => {
        resolve(res)
      }).then(err => {
        reject(err)
      })
    })
  },
  /**
   * POST
   * @param {String} path 接口地址
   * @param {Object} params 接口参数
   * @returns Promise对象
   */
  post: (path, params, header) => {
    path = APIHOST + path
    return new Promise((resolve, reject) => {
      Axios.post(path, params, header).then(res => {
      // Axios.post(path, qs.stringify(params), header).then(res => {
        resolve(res)
      }).then(err => {
        reject(err)
      })
    })
  },
  /**
   * 构建服务对象
   * @param {Object} path 服务配置组
   * @param {commonPath} params 公共路径部分
   * @returns 服务对象
   */
  structureService: (serviceGroups, commonPath) => {
    let structure = {}
    let groupItem
    for (let key in serviceGroups) {
      groupItem = serviceGroups[key]
      // 保存服务集合到全局
      window.apiService[groupItem.service] = groupItem
      structure[groupItem.api || groupItem.service] = ((item) => {
        return (params) => {
          // if (!params.partnerId) {
          //   params.partnerId = utils.getCookie(STATUS.PARTNERID)
          // }
          let token = thatUtils.getCookie(STATUS.TOKEN)
          if (token) {
            item.header = { headers: { token } }
          }

          let url = (commonPath || '') + item.service + '.do'
          // let url = (commonPath || '') + item.service
          // url = item.vxStore ? url + '?vxStore=true' : url
          return (customApi[item.type || 'post'] || customApi.post)(url, params, item.header || {
            // headers: {'Content-Type': 'application/json'}
          })
        }
      })(groupItem)
    }

    return structure
  }
}

export const Get = customApi.get

export const Post = customApi.post

export const StructureService = customApi.structureService

Vue.prototype.$Axios = Axios

Vue.prototype.$get = customApi.get

Vue.prototype.$post = customApi.post
