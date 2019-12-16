/**
 * 主页
 * @authors AndyPan (pye-mail@163.com)
 * @date    2019年10月28日14:28:05
 */

let Popup = Components.use(Components.popup)
let WebSocketComponents = Components.use(Components.websocket)
let { CommonService } = Services.require()
let { LANG, STATUS, SocketHost } = Configs.require()

export default {
  data () {
    return {
      rationClass: null,
      // 计算属性（宽、高）
      computeAttr: {},
      // 闪烁的星星
      isRenderStar: false,
      // 参数集合
      pageParams: null,
      pageQuery: null,
      // 活动信息
      activityInitInfo: {},
      // pageType
      pageType: {
        'answer-screen': { gameType: 'ANSWER_GAME' },
        'countmoney-screen': { gameType: 'COUNT_NUM' },
        'redpacket-screen': { gameType: 'RED_PACK' }
      }
    }
  },
  // 组件
  components: {
    'tip-popup': Popup,
    'web-socket-join': WebSocketComponents,
    'web-socket-rank': WebSocketComponents,
    'web-socket-game': WebSocketComponents,
    'web-socket-activity': WebSocketComponents
  },
  // 属性计算
  computed: {
    /**
     * 星星class
     */
    starClass () {
      return (i) => {
        return i % 10 === 0 ? 'page-countmoney-star page-countmoney-star-big' : i % 20 === 0 ? 'page-countmoney-star page-countmoney-star-medium' : 'page-countmoney-star'
      }
    },
    /**
     * 星星style
     */
    starStyle () {
      let wH = window.innerHeight
      let wW = window.innerWidth
      return () => {
        return `top:${Math.round(Math.random() * wH)}px;left:${Math.round(Math.random() * wW)}px;animation-duration:${Math.round(Math.random() * 3000) + 3000}ms;animation-delay:${Math.round(Math.random() * 3000)}ms;`
      }
    }
  },
  // 方法
  methods: {
    /**
     * 渲染组件
     */
    renderComponent () {
      let page = this.params('page') || PagesMain.index
      this.currentComponent = PagesMain.use(page)

      // 查询活动信息
      this.activityInfo()
    },
    /**
     * 比例缩放
     * @param {*} w
     * @param {*} h
     */
    transformScale (w, h) {
      let styleText = []
      styleText.push('-webkit-transform: scale(#scaleW#, #scaleH#)'.replace('#scaleW#', w).replace('#scaleH#', h))
      styleText.push('-moz-transform: scale(#scaleW#, #scaleH#)'.replace('#scaleW#', w).replace('#scaleH#', h))
      styleText.push('-o-transform: scale(#scaleW#, #scaleH#)'.replace('#scaleW#', w).replace('#scaleH#', h))
      styleText.push('-ms-transform: scale(#scaleW#, #scaleH#)'.replace('#scaleW#', w).replace('#scaleH#', h))
      styleText.push('transform: scale(#scaleW#, #scaleH#)'.replace('#scaleW#', w).replace('#scaleH#', h))

      return styleText.join(';')
    },
    /**
     * 屏幕比例
     */
    renderRatio () {
      let ratio = this.resolutionRatio()
      let screenRation = LANG.screenRation
      let ratioConfig = screenRation[ratio] || screenRation['other']
      this.rationClass = ratioConfig.class
      let configRatio = ratioConfig.ratio
      // if (this.rationClass === 'sceen-ratio-other') {
      let winSize = this.winSize()
      let winWidth = winSize.winWidth
      let winHeight = winSize.winHeight

      /** 以当前最适合的比例展示(计算当前最适合的比例) **/
      let attrHeight
      let attrWidth
      let winRatio = winWidth / winHeight
      let ration169 = screenRation['1.78']
      let ration1610 = screenRation['1.60']
      let ration43 = screenRation['1.33']
      if (winRatio > ration169.ratio) {
        configRatio = ration169.ratio
      } else if (winRatio < ration169.ratio && winRatio > ration1610.ratio) {
        configRatio = ration169.ratio
      } else if (winRatio < ration1610.ratio && winRatio > ration43.ratio) {
        configRatio = ration1610.ratio
      } else {
        configRatio = ration43.ratio
      }
      /** 以当前最适合的比例展示(计算当前最适合的比例) **/

      if (winWidth > winHeight) {
        attrHeight = winHeight
        attrWidth = winHeight * configRatio
        if (attrWidth > winWidth) {
          attrWidth = winWidth
          attrHeight = winWidth / configRatio
        }
      } else if (winHeight > winWidth) {
        attrHeight = winWidth / configRatio
        attrWidth = winWidth
      }
      let attrRatio = (attrWidth / attrHeight).toFixed(2)
      let attrRatioConfig = LANG.screenRation[attrRatio]
      if (attrRatioConfig) {
        // this.rationClass += ' ' + attrRatioConfig.class
        this.rationClass = attrRatioConfig.class
      }
      let scaleRatioW = attrWidth / attrRatioConfig.width
      let scaleRatioH = attrHeight / attrRatioConfig.height
      let styleText = this.transformScale(scaleRatioW, scaleRatioH)
      this.computeAttr.styleText = styleText
      // this.computeAttr.height = attrHeight
      // this.computeAttr.width = attrWidth
      // this.computeAttr.styleText = (attrHeight ? ('height: ' + attrHeight + 'px;') : '') +
      //   (attrWidth ? ('width: ' + attrWidth + 'px;') : '') +
      //   (attrHeight ? ('margin-top: ' + (-attrHeight / 2) + 'px;') : '') +
      //   (attrWidth ? ('margin-left: ' + (-attrWidth / 2) + 'px;') : '')
      // }
    },
    /**
     * 祝福语长度设置
     */
    renderBlessingsTextLen (activityName) {
      let len = activityName.length
      let blessingsGradeGame = ''
      if (len <= 6) {
        blessingsGradeGame = 'leave-1'
      } else if (len > 6 && len <= 12) {
        blessingsGradeGame = 'leave-3'
      } else if (len > 12 && len <= 16) {
        blessingsGradeGame = 'leave-31'
      } else {
        blessingsGradeGame = 'leave-2'
      }
      this.$store.dispatch('activityInfoStoreUpdate', { blessingsGradeGame })
    },
    /**
     * 通过活动信息状态更新页面状态
     */
    formatScreenStatus (activityStatus) {
      let formatStatus = LANG.activityStatusFormatScreen[activityStatus] || {}
      let formatScreen = formatStatus.formatScreen
      let gameStatus = formatScreen
      if (formatScreen === 'doing') {
        // 游戏进行中
        gameStatus = 'ing'
      }
      this.$store.dispatch('activityInfoStoreUpdate', { gameStatus })
      if (gameStatus === 'ing') {
        // 进行中
        this.activityJoinInfo()
        this.activityRankingInfo()
        this.activityGameInfo()
      } else if (gameStatus === 'end') {
        // 排行榜
        this.activityRankingInfo()
      } else {
        this.endScoket()
        // 没有游戏，或者游戏未开始
        this.routeTo(PagesPreheat.router() + '?' + this.pageQuery)
      }
    },
    /**
     * 关闭当前页所有socket
     */
    endScoket () {
      // 关闭所有当前游戏socket
      if (this.activityWebSocket) {
        this.activityWebSocket.close()
        this.activityWebSocket = null
      }
      if (this.joinWebSocket) {
        this.joinWebSocket.close()
        this.joinWebSocket = null
      }
      if (this.rankWebSocket) {
        this.rankWebSocket.close()
        this.rankWebSocket = null
      }
      if (this.gameInfoWebSocket) {
        this.gameInfoWebSocket.close()
        this.gameInfoWebSocket = null
      }
      // 新游戏开始，清空数据
      // 参与人
      this.$store.dispatch('activityJoinStoreUpdate', { activityMemberInfos: [] })
      // 排行榜
      this.$store.dispatch('activityRankStoreUpdate', { activityMemberRankingInfos: [] })
      // 红包数
      this.$store.dispatch('activityInfoStoreUpdate', { surplusRedPackNum: 0 })
    },
    /**
     * 获取socketURI
     * @param {*} type
     */
    getWebSocketURI (type) {
      let body = (this.pageParams || {}).body || {}
      body = typeof (body) === 'string' ? this.transfToJson(body) : body
      let businessKey = (type === 'rankingList' || type === 'activityGameInfo') ? ('activityGame_' + this.activityInitInfo.activityGameId) : body.businessKey
      return SocketHost + 'websocket/text/' + type + '/' + businessKey
    },
    /**
     * 活动状态socket监控
     */
    scoketActivity () {
      let wsURI = this.getWebSocketURI('activityInfo')
      this.activityWebSocket = this.$refs['web-socket-activity'].initWebSocket(wsURI)
      if (this.activityWebSocket) {
        this.activityWebSocket.onmessage = (res) => {
          // console.info(res)
          let data = res.data || {}
          if (typeof (data) === 'string') {
            data = this.transfToJson(data)
          }
          console.info(data)
          let gameSwitch = data.gameSwitch
          let activityGameId = data.activityGameId
          if (gameSwitch === 'CLOSE') {
            let storageGameId = this.getLocalStorage(STATUS.ACTIVITYGAMEID)
            if (storageGameId === activityGameId) {
              this.$store.dispatch('activityInfoStoreUpdate', { gameStatus: 'end' })
            }
          } else if (gameSwitch === 'OPEN') {
            this.setLocalStorage(STATUS.ACTIVITYGAMEID, activityGameId)
            this.endScoket()
            this.routeTo(PagesPreheat.router() + '?' + this.pageQuery)
          }
        }
        // 定时发送，保持连接
        this.threadScoket((thisDate) => {
          if (this.activityWebSocket) {
            console.info('活动--->send(' + thisDate + ')')
            this.activityWebSocket.send('')
          } else {
            return false
          }
        })
      }
    },
    /**
     * 活动参与socket监控
     */
    scoketActivityJoin () {
      let wsURI = this.getWebSocketURI('joinActivityCustomerList')
      this.joinWebSocket = this.$refs['web-socket-join'].initWebSocket(wsURI)
      if (this.joinWebSocket) {
        this.joinWebSocket.onmessage = (res) => {
          // console.info(res)
          let data = res.data || {}
          if (typeof (data) === 'string') {
            /* eslint-disable */
            data = eval('(' + data + ')')
          }
          console.info(data)
          this.$store.dispatch('activityJoinStoreUpdate', { activityMemberInfos: data.activityMemberInfos })
        }
        // 定时发送，保持连接
        this.threadScoket((thisDate) => {
          if (this.joinWebSocket) {
            console.info('参与人--->send(' + thisDate + ')')
            this.joinWebSocket.send('')
          } else {
            return false
          }
        })
      }
    },
    /**
     * 排行榜socket监控
     */
    scoketActivityRank () {
      let wsURI = this.getWebSocketURI('rankingList')
      this.rankWebSocket = this.$refs['web-socket-rank'].initWebSocket(wsURI)
      if (this.rankWebSocket) {
        this.rankWebSocket.onmessage = (res) => {
          // console.info(res)
          let data = res.data || {}
          if (typeof (data) === 'string') {
            /* eslint-disable */
            data = eval('(' + data + ')')
          }
          console.info(data)
          this.$store.dispatch('activityRankStoreUpdate', { activityMemberRankingInfos: data.activityMemberRankingInfos })
        }
        // 定时发送，保持连接
        this.threadScoket((thisDate) => {
          if (this.rankWebSocket) {
            console.info('排行榜--->send(' + thisDate + ')')
            this.rankWebSocket.send('')
          } else {
            return false
          }
        })
      }
    },
    /**
     * 红包游戏数据socket监控
     */
    scoketActivityGameInfo () {
      let wsURI = this.getWebSocketURI('activityGameInfo')
      this.gameInfoWebSocket = this.$refs['web-socket-game'].initWebSocket(wsURI)
      if (this.gameInfoWebSocket) {
        this.gameInfoWebSocket.onmessage = (res) => {
          // console.info(res)
          let data = res.data || {}
          if (typeof (data) === 'string') {
            /* eslint-disable */
            data = eval('(' + data + ')')
          }
          console.info(data)
          let redPackInfo = data.redPackInfo || {}
          this.$store.dispatch('activityInfoStoreUpdate', {
            surplusRedPackNum: redPackInfo.surplusRedPackNum
          })
        }
        // 定时发送，保持连接
        this.threadScoket((thisDate) => {
          if (this.gameInfoWebSocket) {
            console.info('红包数--->send(' + thisDate + ')')
            this.gameInfoWebSocket.send('')
          } else {
            return false
          }
        })
      }
    },
    /**
     * 红包剩余数
     */
    activityGameInfo () {
      if (this.activityInitInfo.projectionGameType === 'RED_PACK') {
        let params = 'businessKey=activityGame_' + this.activityInitInfo.activityGameId
        CommonService.activityGameInfo(params).then(res => {
          let data = res.data
          if (data.success) {
            let entity = data.entity
            let redPackInfo = entity.redPackInfo || {}
            this.$store.dispatch('activityInfoStoreUpdate', { surplusRedPackNum: redPackInfo.surplusRedPackNum })
            // console.info(entity)
            this.scoketActivityGameInfo()
          }
        }).catch(err => {
          this.$refs['tip-popup'].tip(err.message)
        })
      }
    },
    /**
     * 游戏排行榜
     */
    activityRankingInfo () {
      let params = 'businessKey=activityGame_' + this.activityInitInfo.activityGameId
      CommonService.activityRankingInfo(params).then(res => {
        let data = res.data
        if (data.success) {
          let entity = data.entity
          let activityMemberRankingInfos = entity.activityMemberRankingInfos
          if (activityMemberRankingInfos) {
            this.$store.dispatch('activityRankStoreUpdate', { activityMemberRankingInfos })
          }
          // console.info(entity)
          this.scoketActivityRank()
        }
      }).catch(err => {
        this.$refs['tip-popup'].tip(err.message)
      })
    },
    /**
     * 活动用户参与情况
     */
    activityJoinInfo () {
      let body = (this.pageParams || {}).body || {}
      body = typeof (body) === 'string' ? this.transfToJson(body) : body
      let businessKey = body.businessKey
      CommonService.activityJoinInfo('businessKey=' + businessKey).then(res => {
        let data = res.data
        if (data.success) {
          let entity = data.entity
          let activityMemberInfos = entity.activityMemberInfos
          if (activityMemberInfos) {
            this.$store.dispatch('activityJoinStoreUpdate', { activityMemberInfos })
          }
          // console.info(entity)
          this.scoketActivityJoin()
        }
      }).catch(err => {
        this.$refs['tip-popup'].tip(err.message)
      })
    },
    /**
     * 活动信息
     */
    activityInfo () {
      let body = (this.pageParams || {}).body || {}
      body = typeof (body) === 'string' ? this.transfToJson(body) : body
      let businessKey = body.businessKey
      if (businessKey) {
        CommonService.activityInfo('businessKey=' + businessKey).then(res => {
          let data = res.data
          if (data.success) {
            let entity = data.entity
            // console.info(entity)
            this.activityInitInfo = entity
            let projectionGameType = entity.projectionGameType
            // 如果打开的路由地址跟当前的游戏类型不相符，则自动跳转到对应游戏的页面
            let paramsPage = this.params('page')
            let pageType = this.pageType[paramsPage]
            if (pageType) {
              if (pageType.gameType !== projectionGameType) {
                let projectionGameTypeScreen = LANG.projectionGameTypeScreen[projectionGameType]
                if (projectionGameTypeScreen) {
                  this.routeTo(projectionGameTypeScreen.path + '?' + this.pageQuery)
                }
              }
            }
            let activityLinkman = entity.activityLinkman.split('&')
            let blessingsRemark = ''
            if (entity.sceneType === 'marry') {
              blessingsRemark = '新郎：' + activityLinkman[0] + ' 新娘：' + activityLinkman[1]
            } else if (entity.sceneType === 'baobao') {
              blessingsRemark = '宝宝：' + activityLinkman[0]
            } else if (entity.sceneType === 'birthday') {
              blessingsRemark = '寿星：' + activityLinkman[0]
            } else if (entity.sceneType === 'themeCustom') {
              blessingsRemark = '主题：' + activityLinkman[0]
            }
            let activityName = entity.activityName
            // 更新活动信息状态
            this.$store.dispatch('activityInfoStoreUpdate', {
              // 活动信息
              activityInfo: entity,
              // 当前活动的当前游戏类型
              projectionGameType: projectionGameType,
              // 活动名称
              blessingsText: activityName,
              // 活动备注
              blessingsRemark: blessingsRemark
            })
            this.setLocalStorage(STATUS.ACTIVITYGAMEID, entity.activityGameId)
            this.setWebSiteTitle(activityName)
            this.renderBlessingsTextLen(activityName)
            this.formatScreenStatus(entity.activityStatus)
            this.scoketActivity()
          }
        }).catch(err => {
          this.$refs['tip-popup'].tip(err.message)
        })
      }
    },
    /**
     * 视图body点击事件
     */
    bodyClickEvent (e) {
      e = e || window.event
      let target = e.target || e.srcElement
      if (this.hasClass(target, 'j-button-reset')) {
        // 返回暖场页
        this.endScoket()
        this.routeTo(PagesPreheat.router() + '?' + this.pageQuery)
      }
    }
  },
  // 监听
  watch: {
    /**
     * 路由改变监听
     */
    '$route' () {
      this.renderComponent()
    }
  },
  created () {
    let params = this.params()
    params.body = this.transfToJson(params.body)
    let winHref = window.location.href
    this.pageParams = params
    this.pageQuery = winHref.split('?')[1]
    this.renderComponent()
    let that = this
    window.onresize = () => {
      window.setTimeout(() => {
        that.renderRatio()
      }, 580)
    }
    this.renderRatio()
  }
}
