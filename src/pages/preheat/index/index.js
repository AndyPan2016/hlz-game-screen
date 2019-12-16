/**
 * 预热页
 * @authors AndyPan (pye-mail@163.com)
 * @date    2019年10月28日16:49:32
 */

let Barrage = Components.use(Components.barrage)
let Popup = Components.use(Components.popup)
let WebSocketComponents = Components.use(Components.websocket)
let { CommonService, ProjectionService } = Services.require()
let { STATUS, LANG, SocketHost } = Configs.require()

export default {
  data () {
    return {
      // 活动照片
      // preheatThumb: 'http://market.test.ihunlizhe.com/media/2019/08/02/201908021616040316921.jpg',
      preheatThumb: null,
      // 祝福语
      blessingsText: '加载中',
      // 祝福备注
      blessingsRemark: '加载中',
      blessingsGrade: '',
      blessingsGradeGame: '',
      // 活动二维码
      qrCode: null,
      // 弹幕数据
      // barrageDataSet: [{text: '新婚快乐新婚快乐新婚快乐新婚快乐'}, {text: '2'}, {text: '3'}, {text: '4'}, {text: '5'}, {text: '6'}, {text: '7'}, {text: '8'}, {text: '9'}, {text: '10'}],
      barrageDataSet: [],
      // 游戏即将开始
      gameBeginInAMinute: false,
      // 游戏开始前倒计时时间(单位：秒)
      gameBeginCountDownTimer: 5,
      // 倒计时
      gameBeginCountDownClass: '',
      // 游戏开始(false doing ing end)
      gameStart: false,
      // 参数集合
      pageParams: null,
      pageQuery: null,
      activityInit: false,
      // 初始化活动信息
      activityInitInfo: {},
      // 活动socket
      activityWebSocket: null,
      // 弹幕socket
      bulletWebSocket: null,
      // 活动加入
      joinWebSocket: null,
      // 排行
      rankWebSocket: null,
      // 参与活动用户
      activityMemberInfos: [],
      // 排行榜
      activityMemberRankingInfos: [],
      // 昵称占位
      nickNamePH: '无'
      // 根据游戏类型展示对应大屏
      // projectionGameTypeScreen: LANG.projectionGameTypeScreen
      // projectionGameTypeScreen: {
      //   // 答题大屏
      //   'ANSWER_GAME': { path: PagesMain.router(PagesMain.answerScreen) },
      //   // 摇一摇红包大屏
      //   'RED_PACK': { path: PagesMain.router(PagesMain.redPacketScreen) },
      //   // 数钱大屏
      //   'COUNT_NUM': { path: PagesMain.router(PagesMain.countMoneyScreen) }
      // }
    }
  },
  components: {
    'barrage': Barrage,
    'tip-popup': Popup,
    'web-socket-activity': WebSocketComponents,
    'web-socket-bullet': WebSocketComponents
  },
  methods: {
    /**
     * 预热界面图片设置
     * @param {*} e
     */
    preheatThumbLoad (e) {
      let target = e.target || e.srcElement
      if (target) {
        let w = target.offsetWidth
        let h = target.offsetHeight
        let pNode = target.parentNode
        let pW = pNode.offsetWidth
        let pH = pNode.offsetHeight
        if (w > h) {
          target.style.maxWidth = 'none'
          target.style.height = '100%'
          w = target.offsetWidth
          if (w - pW < 0) {
            target.style.width = '100%'
            target.style.height = 'auto'
            target.style.minHeight = '100%'
            target.style.maxHeight = 'none'
            h = target.offsetHeight
            target.style.marginTop = -((h - pH) / 2) + 'px'
          } else {
            target.style.marginLeft = -((w - pW) / 2) + 'px'
          }
        } else if (h > w) {
          target.style.maxHeight = 'none'
          target.style.width = '100%'
          h = target.offsetHeight
          if (h - pH < 0) {
            target.style.height = '100%'
            target.style.width = 'auto'
            target.style.minWidth = '100%'
            target.style.maxWidth = 'none'
            w = target.offsetWidth
            target.style.marginLeft = -((w - pW) / 2) + 'px'
          } else {
            target.style.marginTop = -((h - pH) / 2) + 'px'
          }
        } else {
          target.style.maxHeight = 'none'
          target.style.width = '100%'
          h = target.offsetHeight
          target.style.marginTop = -((h - pH) / 2) + 'px'
        }
      }
    },
    /**
     * 祝福语长度设置
     */
    renderBlessingsTextLen () {
      // this.blessingsText = '新婚快乐新婚新婚新婚新婚新婚新婚新婚'
      let blessingsText = this.blessingsText
      let len = blessingsText.length
      // if (len > 8 && len <= 16) {
      //   this.blessingsGrade = 'grade-2'
      // } else if (len > 16) {
      //   this.blessingsGrade = 'grade-3'
      // }
      if (len > 8 && len <= 12) {
        this.blessingsGrade = 'grade-2'
      } else if (len > 12 && len <= 16) {
        this.blessingsGrade = 'grade-3'
      } else if (len > 16) {
        this.blessingsGrade = 'grade-4'
      }
      if (len <= 6) {
        this.blessingsGradeGame = 'leave-1'
      } else if (len > 6 && len <= 12) {
        this.blessingsGradeGame = 'leave-3'
      } else if (len > 12 && len <= 16) {
        this.blessingsGradeGame = 'leave-31'
      } else {
        this.blessingsGradeGame = 'leave-2'
      }
    },
    /**
     * 游戏开始前倒计时
     */
    gameBeginCountDown (callBack) {
      let that = this
      let count = this.gameBeginCountDownTimer
      this.gameBeginCountDownClass = 'num-' + count
      let countDownFn = () => {
        setTimeout(() => {
          if (count <= 1) {
            // 倒计时结束，跳转对应大屏页面
            // that.routeTo(PagesMain.router(PagesMain.answerScreen) + '?' + that.pageQuery)
            let gameType = this.activityInitInfo.projectionGameType
            let projectionGameTypeScreen = LANG.projectionGameTypeScreen[gameType]
            if (projectionGameTypeScreen) {
              that.endScoket()
              that.routeTo(projectionGameTypeScreen.path + '?' + that.pageQuery)
            }
          } else {
            count--
            that.gameBeginCountDownClass = 'num-' + count
            countDownFn()
          }
        }, 1000)
      }
      if (!this.gameStart) {
        setTimeout(() => {
          countDownFn()
        }, 1000)
      }
    },
    /**
     * 通过活动信息状态更新页面状态
     */
    formatScreenStatus (activityStatus) {
      activityStatus = activityStatus || this.activityInitInfo.activityStatus
      let formatStatus = LANG.activityStatusFormatScreen[activityStatus] || {}
      let formatScreen = formatStatus.formatScreen
      let gameType = this.activityInitInfo.projectionGameType
      let projectionGameTypeScreen = LANG.projectionGameTypeScreen[gameType]
      if (formatScreen === 'doing') {
        // 游戏即将开始(指定的游戏类型大屏存在)
        if (projectionGameTypeScreen) {
          this.gameStart = false
          this.gameBeginInAMinute = true
          this.gameBeginCountDown()
        }
      } else {
        // this.gameStart = formatScreen
        if (formatScreen === 'ing') {
          // 进行中
          // if (gameType === 'ANSWER_GAME') {
          //   this.routeTo(PagesMain.router(PagesMain.answerScreen) + '?' + this.pageQuery)
          // }
          if (projectionGameTypeScreen) {
            this.routeTo(projectionGameTypeScreen.path + '?' + this.pageQuery)
          }
        } else if (formatScreen === 'end') {
          // 没有游戏，或者游戏未开始
          this.scoketActivity()
          // 弹幕列表
          this.bulletScreenList()
        } else {
          // 没有游戏，或者游戏未开始
          this.scoketActivity()
          // 弹幕列表
          this.bulletScreenList()
        }
      }
    },
    /**
     * 获取socketURI
     * @param {*} type
     */
    getWebSocketURI (type) {
      let businessKey = type === 'rankingList' ? ('activityGame_' + this.activityInitInfo.activityGameId) : ((this.pageParams || {}).body || {}).businessKey
      return SocketHost + 'websocket/text/' + type + '/' + businessKey
    },
    /**
     * 关闭当前页所有socket
     */
    endScoket () {
      if (this.activityWebSocket) {
        this.activityWebSocket.close()
        this.activityWebSocket = null
      }
      if (this.bulletWebSocket) {
        this.bulletWebSocket.close()
        this.bulletWebSocket = null
      }
    },
    /**
     * 活动状态socket监控
     */
    scoketActivity () {
      let wsURI = this.getWebSocketURI('activityInfo')
      this.activityWebSocket = this.$refs['web-socket-activity'].initWebSocket(wsURI)
      if (this.activityWebSocket) {
        this.activityWebSocket.onmessage = (res) => {
          let data = res.data || {}
          // console.info(data)
          if (typeof (data) === 'string') {
            data = this.transfToJson(data)
          }
          console.info(data)
          let gameSwitch = data.gameSwitch
          // let businessKey = data.businessKey
          // let activityGameId = data.activityGameId
          let gameType = data.gameType
          this.setCookie(STATUS.GAMETYPE, gameType)
          this.activityInitInfo.projectionGameType = gameType
          let projectionGameTypeScreen = LANG.projectionGameTypeScreen[gameType]
          this.setLocalStorage(STATUS.ACTIVITYGAMEID, data.activityGameId)
          if (gameSwitch === 'OPEN') {
            if (projectionGameTypeScreen) {
              this.gameStart = false
              this.gameBeginInAMinute = true
              this.gameBeginCountDown()
            }
          } else {
            if (projectionGameTypeScreen) {
              this.endScoket()
              this.routeTo(projectionGameTypeScreen.path + '?' + this.pageQuery)
            }
          }
        }
        // 定时一分钟发送
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
     * 弹幕socket监控
     */
    scoketBulletScreen () {
      let wsURI = this.getWebSocketURI('bulletScreen')
      this.bulletWebSocket = this.$refs['web-socket-bullet'].initWebSocket(wsURI)
      if (this.bulletWebSocket) {
        this.bulletWebSocket.onmessage = (res) => {
          // console.info(res)
          let data = res.data || {}
          if (typeof (data) === 'string') {
            data = this.transfToJson(data)
          }
          console.info(data)
          let barrageTarget = this.$refs['my-barrage']
          if (barrageTarget) {
            barrageTarget.pushCurrentBarrage([{ text: data.message, headImg: data.headImg }]).barrageRuning()
          }
        }
        // 定时一分钟发送
        this.threadScoket((thisDate) => {
          if (this.bulletWebSocket) {
            console.info('弹幕--->send(' + thisDate + ')')
            this.bulletWebSocket.send('')
          } else {
            return false
          }
        })
      }
    },
    /**
     * 弹幕列表
     */
    bulletScreenList () {
      let businessKey = ((this.pageParams || {}).body || {}).businessKey
      CommonService.bulletScreenList('businessKey=' + businessKey).then(res => {
        let data = res.data
        if (data.success) {
          let entity = data.entity
          console.info(entity)
          let bulletScreenInfos = entity.bulletScreenInfos
          if (bulletScreenInfos && bulletScreenInfos.length) {
            let temp = []
            this.forEach(bulletScreenInfos, item => {
              temp.push({ text: item.message, headImg: item.headImg })
            })
            this.barrageDataSet = temp
            let barrageTarget = this.$refs['my-barrage']
            if (barrageTarget) {
              barrageTarget.pushBarrage(temp).barrageRuning()
            }
          }
          // 启动弹幕socket监控
          this.scoketBulletScreen()
        }
      }).catch(err => {
        this.$refs['tip-popup'].tip(err.message)
      })
    },
    /**
     * 活动信息
     */
    activityInfo () {
      let businessKey = ((this.pageParams || {}).body || {}).businessKey
      console.info(this.pageParams)
      if (businessKey) {
        CommonService.activityInfo('businessKey=' + businessKey).then(res => {
          let data = res.data
          if (data.success) {
            let entity = data.entity
            console.info(entity)
            let projectionGameType = entity.projectionGameType
            this.setCookie(STATUS.GAMETYPE, projectionGameType)
            this.activityInitInfo = entity
            this.qrCode = entity.imgCode
            // this.preheatThumb = entity.pictureList ? entity.pictureList.length : 0
            this.blessingsText = entity.activityName
            let activityLinkman = entity.activityLinkman.split('&')
            if (entity.sceneType === 'marry') {
              this.blessingsRemark = '新郎：' + activityLinkman[0] + ' 新娘：' + activityLinkman[1]
            } else if (entity.sceneType === 'baobao') {
              this.blessingsRemark = '宝宝：' + activityLinkman[0]
            } else if (entity.sceneType === 'birthday') {
              this.blessingsRemark = '寿星：' + activityLinkman[0]
            } else if (entity.sceneType === 'themeCustom') {
              this.blessingsRemark = '主题：' + activityLinkman[0]
            }
            this.activityInit = true
            this.setLocalStorage(STATUS.ACTIVITYGAMEID, entity.activityGameId)
            this.setWebSiteTitle(entity.activityName)
            this.renderBlessingsTextLen()
            this.formatScreenStatus()
            // 预热图片播放
            this.picturePlay()
          }
        }).catch(err => {
          this.activityInit = true
          this.$refs['tip-popup'].tip(err.message)
        })
      }
    },
    /**
     * 授权
     */
    authorization () {
      ProjectionService.authorization(this.pageQuery).then(res => {
        let data = res.data
        if (data.success) {
          let dataset = data.data || {}
          let token = dataset.token
          if (token) {
            this.setCookie(STATUS.TOKEN, token)
            this.activityInfo()
          }
        }
      }).catch(err => {
        this.$refs['tip-popup'].tip(err.message)
      })
    },
    /**
     * 预热图片播放
     */
    picturePlay () {
      let activityInitInfo = this.activityInitInfo
      let pictureList = activityInitInfo.pictureList || []
      let videoList = activityInitInfo.videoList
      if (!videoList || !videoList.length) {
        if (pictureList.length > 1) {
          let index = 0
          let play = () => {
            let temp = []
            this.forEach(pictureList, (item, idx) => {
              item.active = index === parseInt(idx) ? 'active' : ''
              temp.push(item)
            })
            this.activityInitInfo.pictureList = temp
            index++
            if (index > pictureList.length - 1) {
              index = 0
            }
            setTimeout(play, 10000)
          }
          play()
        } else if (pictureList[0]) {
          pictureList[0].active = 'active'
        }
      }
    }
  },
  created () {
    let params = this.params()
    params.body = this.transfToJson(params.body)
    this.pageParams = params
    this.pageQuery = window.location.href.split('?')[1]
    this.setWebSiteTitle(this.blessingsText)
    this.renderBlessingsTextLen()
  },
  mounted () {
    this.authorization()
  }
}
