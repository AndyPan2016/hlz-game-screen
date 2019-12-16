import Vue from 'vue'
import Router from 'vue-router'
require('@/configs/module')

let PagePreheat = PagesLayout.use(PagesLayout.preheat)
let PageMain = PagesLayout.use(PagesLayout.main)
let NotFound = PagesCommons.use(PagesCommons['404'])

Vue.use(Router)

// 路由配置
const routes = [
  // 预热页
  {
    path: '/',
    name: 'PagePreheat',
    component: PagePreheat,
    key: 'PagesMain'
  },
  // 预热页
  {
    path: '/layout-preheat/:page',
    name: 'PagePreheat',
    component: PagePreheat,
    key: 'PagesPreheat'
  },
  // 主页
  {
    path: '/layout-main/:page',
    name: 'PageMain',
    component: PageMain,
    key: 'PagesMain'
  },
  // 404
  { path: '*', component: NotFound }
]

;((routes, win) => {
  let i = 0
  let len = routes.length
  let route
  let key
  for (; i < len; i++) {
    route = routes[i]
    key = route.key
    if (key) {
      win[key] = win[key] || {}
      if (win[key]) {
        ((route) => {
          win[key]['router'] = (name) => {
            return route.path.replace(':page', name || 'index')
          }
        })(route)
        route['pages'] = win[key].fileName
      }
    }
  }
})(routes, window)

// 创建router对路由进行管理，由构造函数 new Router()创建，接收routes参数
const router = new Router({
  mode: 'history',
  routes: routes
})

// 路由拦截器
router.beforeEach((to, from, next) => {
  // let userNo = utils.getCookie(STATUS.USERNO)
  // if (!userNo && to.path !== '/' && to.path !== '/layout-transfer/index' && to.path !== '/layout-common/process-status') {
  //   next({path: '/layout-transfer/index'})
  // } else {
  //   next()
  // }
  next()
})

export default router
