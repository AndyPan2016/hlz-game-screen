/**
 * Popup
 * @authors AndyPan (pye-mail@163.com)
 * @date    2018-08-14 09:40:22
 */

let render = {
  data () {
    return {
      // 是否可见
      isVisible: false,
      // 显示&关闭弹出框
      isShow: false,
      // 标题(data中的属性名称不能与props中的名称一样，会冲突，与react不同的是props和status的属性都是通过this获取)
      popupTitle: 'My Popup Title',
      // 弹出框内容
      popupContent: 'My Popup Content',
      // downup类型弹出框的选项数据
      popupDownUpData: undefined,
      // 弹出框类型（alert:提示框、confirm:确认框、prompt:弹出输入框、tip:文字提示框、downup:由下往上弹出）
      popupType: 'default',
      // 自动关闭时间
      popupTimeout: 4000,
      // 自定义Class
      customClass: '',
      // 自定义按钮(默认始终显示sure和cancel)
      customButtons: {
        // { text: '按钮文字', isVisible: '是否显示按钮(因为默认sure和cancel是始终显示的)', fn: '按钮点击函数(默认任意一个按钮点击都会关闭弹出框，可以自定义函数并return false来阻止关闭)' }
        sure: { text: '确定', isVisible: true, fn: null },
        cancel: { text: '取消', isVisible: true }
      },
      pickerRef: '',
      pickerDateModel: new Date(),
      pickerObject: null,
      popupSecondTitle: {},
      popupPromptModel: null,
      popupPromptPlaceHolder: '请输入',
      popupPromptVerify: null,
      promptType: null,
      cityMapData: null,
      mockCityData: null,
      tempProvince: null,
      tempCity: null,
      popupToTop: ''
    }
  },
  props: [
    // *** 属性 ***/
    'full',
    'spaceMin',
    // 自定义Class，用于重写样式
    'className',
    // 是否点击遮罩层关闭弹出框
    'isMaskClickHide',
    // 初始时直接显示
    'initShow',
    // 弹出框title
    'title',
    // 弹出框消息内容
    'message', 'content', 'downupData',
    // 弹出框类型（alert:提示框、confirm:确认框、prompt:弹出输入框、tip:文字提示框）
    'type',
    // picker数据
    'picker',
    'pickerType',
    'pickerDate',
    'pickerMinDate',
    'pickerFormatter',
    'onPickerChange',
    'secondTitle',
    'model',
    // 自动关闭时间
    'timeout',
    // 弹出框图标（info、warm、error、loading）
    'icon',
    // 自定义按钮
    'buttons', 'downupButton',
    'sureText', 'cancelText',
    // 是否启用城市联动
    'cityLinkage',
    // *** 属性 ***/
    // *** 事件 ***/
    // mask点击自定义事件
    'onMaskClick',
    // 弹出框打开前事件
    'onOpenBefore',
    // 弹出框打开后事件
    'onOpen',
    // 弹出框关闭前事件
    'onCloseBefore',
    // 弹出框关闭后事件
    'onClose',
    // 弹出框确定(sure类型)按钮事件
    'onSure',
    // 弹出框取消(cancel类型)按钮事件
    'onCancel',
    // 倒计时回调(只有type=tip时有效)
    'threadCallBack',
    // downup选项点击事件
    'onDownupItemClick',
    // 所有按钮的点击事件
    'onButtonClick'
    // *** 事件 ***/
  ],
  computed: {
    thisDevice () {
      return this.isMobile() ? 'ui-popup-mobile' : ''
    }
  },
  methods: {
    setPopupToTop (value) {
      // if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
      //   this.popupToTop = value
      // }
      this.popupToTop = value
    },
    // 打开弹出框
    open () {
      // 响应弹出框打开前事件
      let onOpenBefore = this.onOpenBefore
      if (this.isFunction(onOpenBefore)) {
        if (this.isFalse(onOpenBefore())) {
          return false
        }
      }

      this.isVisible = true
      this.isShow = true

      // 响应弹出框打开后事件
      let onOpen = this.onOpen
      if (this.isFunction(onOpen)) {
        onOpen()
      }

      // 设置自动关闭定时器
      if (this.type === 'tip' || this.popupType === 'tip') {
        let timeout = this.timeout || this.popupTimeout
        setTimeout(() => { this.close() }, timeout)
        // 自动关闭倒计时
        let threadCallBack = this.threadCallBack
        if (this.isFunction(threadCallBack)) {
          let allTime = (timeout / 1000) - 1
          let result
          let myThread = setInterval(() => {
            allTime--
            if (allTime <= -1) {
              clearInterval(myThread)
            }
            result = threadCallBack(allTime)
            if (result) {
              this.popupContent = result
            }
          }, 1000)
        }
      }
    },
    // 关闭弹出框
    close () {
      // 响应弹出框关闭前事件
      let onCloseBefore = this.onCloseBefore
      if (this.isFunction(onCloseBefore)) {
        if (this.isFalse(onCloseBefore())) {
          return false
        }
      }

      this.isShow = false
      // 关闭有0.6秒的动画效果，需延迟不可见
      setTimeout(() => {
        this.isVisible = false
      }, 600)

      // 响应弹出框关闭后事件
      let onClose = this.onClose || this.onPopupClose
      if (this.isFunction(onClose)) {
        onClose()
      }
    },
    // alert提示
    alert (title, msg, sure, close) {
      if (typeof (title) === 'object') {
        close = title.close
        sure = title.sure
        msg = title.msg
        title = title.title
      }
      if (typeof (msg) === 'function') {
        close = sure
        sure = msg
        msg = title
        title = undefined
      }
      // if (!msg && !sure) {
      //   msg = title
      //   title = undefined
      // }
      this.popupType = 'alert'
      this.renderTypeBtn()
      this.onPopupClose = close
      // this.popupContent = msg
      // this.popupTitle = title || this.popupTitle
      this.popupContent = ''
      this.popupTitle = ''
      this.popupSecondTitle = {
        title: title,
        remark: msg
      }
      this.customButtons.sure.fn = sure

      this.open()
    },
    // confirm提示
    confirm (title, msg, sure, cancel, close) {
      if (typeof (title) === 'object') {
        close = title.close
        cancel = title.cancel
        sure = title.sure
        msg = title.msg
        title = title.title
      }
      if (typeof (msg) === 'function') {
        close = cancel
        cancel = sure
        sure = msg
        msg = title
        title = undefined
      }
      // if (!msg && !sure && !cancel) {
      //   msg = title
      //   title = undefined
      // }
      this.popupType = 'confirm'
      this.renderTypeBtn()
      this.onPopupClose = close
      // this.popupContent = msg
      // this.popupTitle = title || this.popupTitle
      this.popupContent = ''
      this.popupTitle = ''
      this.popupSecondTitle = {
        title: title,
        remark: msg
      }
      this.customButtons.sure.fn = sure
      this.customButtons.cancel.fn = cancel

      this.open()
    },
    prompt (title, msg, sure, cancel, close, params) {
      if (typeof (title) === 'object') {
        close = title.close
        cancel = title.cancel
        sure = title.sure
        msg = title.msg
        title = title.title
      }
      if (typeof (msg) === 'function') {
        close = cancel
        cancel = sure
        sure = msg
        msg = title
        title = undefined
      }
      // if (!msg && !sure && !cancel) {
      //   msg = title
      //   title = undefined
      // }
      this.popupType = 'prompt'
      this.promptType = null
      this.popupPromptModel = null
      params = params || {}
      this.popupPromptModel = params.value
      this.popupPromptPlaceHolder = params.placeholder || '请输入'
      this.popupPromptVerify = params.request ? 'request' : ''

      this.renderTypeBtn()
      this.onPopupClose = close
      // this.popupContent = msg
      // this.popupTitle = title || this.popupTitle
      this.popupContent = ''
      this.popupTitle = ''
      this.popupSecondTitle = {
        title: title,
        remark: msg
      }
      this.customButtons.sure.fn = sure
      this.customButtons.cancel.fn = cancel

      this.open()
      let that = this
      setTimeout(() => {
        that.$refs['j-popup-prompt'].focus()
      }, 180)
    },
    // tip提示
    tip (msg, timeout, callBack) {
      if (typeof (msg) === 'object') {
        callBack = msg.callBack
        timeout = msg.timeout
        msg = msg.msg
      }
      if (typeof (timeout) === 'function') {
        callBack = timeout
        timeout = undefined
      }
      this.popupType = 'tip'
      this.customClass = ''
      this.onPopupClose = callBack
      this.popupTimeout = timeout || this.popupTimeout
      this.popupContent = msg || 'tip message'

      this.open()
    },
    toast (msg, type, timeout, callBack) {
      if (typeof (msg) === 'object') {
        callBack = msg.callBack
        timeout = msg.timeout
        msg = msg.msg
        type = msg.type
      }
      if (typeof (timeout) === 'function') {
        callBack = timeout
        timeout = undefined
      }
      this.popupType = 'tip'
      this.customClass = ' toast ' + (type || 'success')
      this.onPopupClose = callBack
      this.popupTimeout = timeout || this.popupTimeout
      this.popupContent = msg || 'toast message'

      this.open()
    },
    // loading提示
    loading (msg) {
      this.popupType = 'loading'
      this.customClass = ''
      this.popupContent = msg || 'loading message'

      this.open()
    },
    // mask点击事件
    maskClickEvent (e) {
      // 响应用户自定义mask点击事件
      let onMaskClick = this.onMaskClick
      if (this.isFunction(onMaskClick)) {
        // 用户自定义事件优先，如果返回false，阻止继续执行
        if (this.isFalse(onMaskClick(e))) {
          return false
        }
      }
      // 如果设置了点击mask关闭弹出框时执行
      if (this.isTrue(this.isMaskClickHide) || (this.popupType === 'downup' && this.isMaskClickHide !== false)) {
        this.close()
      }
    },
    // 头部tools关闭按钮点击事件
    toolsCloseEvent (e) {
      this.close()
    },
    // 底部按钮栏点击事件
    ftClickEvent (e) {
      e = e || window.event
      let target = e.target || e.srcElement
      if (this.hasClass(target, 'j-popup-btn')) {
        // 判断按钮类型
        let btnType = target.getAttribute('data-type')
        let resultData = {value: target.getAttribute('data-value'), text: target.innerHTML}
        if (btnType) {
          let popupType = this.popupType
          let promptModel = null
          if (popupType === 'prompt' && btnType === 'sure') {
            promptModel = this.popupPromptModel
            let popupPromptVerify = this.popupPromptVerify
            if (!promptModel) {
              if (popupPromptVerify && popupPromptVerify.indexOf('request') > -1) {
                this.promptType = 'request'
                this.$refs['j-popup-prompt'].focus()
                let that = this
                this.$refs['j-popup-prompt'].onkeyup = () => {
                  that.promptType = this.popupPromptModel ? null : 'request'
                }
                return
              } else {
                this.promptType = null
                this.$refs['j-popup-prompt'].onkeyup = undefined
              }
            }
          }
          // 获取按钮对象
          let button = this.customButtons[btnType]
          // 1.首先响应该类型按钮的操作函数
          let buttonFn = button.fn
          if (this.isFunction(buttonFn)) {
            if (this.isFalse(buttonFn.call(target, e, resultData, promptModel))) {
              return false
            }
          }

          // 2.其次响应on事件
          if (btnType.toLowerCase() === 'sure') {
            if (this.type === 'picker') {
              let pickerTarget = target.parentNode.parentNode.parentNode
              let eachPickerTarget = (className, targetNode) => {
                let i = 0
                let each = (target) => {
                  let clas = className[i]
                  i++
                  let child = target.children
                  for (let a = 0, len = child.length; a < len; a++) {
                    let childItem = child[a]
                    if (this.hasClass(childItem, clas)) {
                      if (i === className.length) {
                        return childItem
                      } else {
                        return each(childItem)
                      }
                    }
                  }
                }
                return each(targetNode)
              }
              let pickerSure = eachPickerTarget(['picker-bd', 'picker-wrap', 'van-picker', 'van-hairline--top-bottom', 'van-picker__confirm'], pickerTarget)
              pickerSure.click()
            }
            if (this.pickerType) {
              // 日期选择
              let that = this
              setTimeout(() => {
                let pickerDatas = null
                if (that.pickerObject) {
                  pickerDatas = that.pickerObject.getValues()
                }
                // 响应onSure事件
                let onSure = that.onSure
                if (this.isFunction(onSure)) {
                  if (this.isFalse(onSure.call(target, e, resultData, that.pickerDateModel, pickerDatas))) {
                    return false
                  }
                }
              }, 100)
            } else {
              // 其他选择
              let pickerDatas = this.$refs[this.pickerRef] ? this.$refs[this.pickerRef].getValues() : (this.popupType === 'prompt' ? this.popupPromptModel : null)
              // 响应onSure事件
              let onSure = this.onSure
              if (this.isFunction(onSure)) {
                if (this.isFalse(onSure.call(target, e, resultData, pickerDatas))) {
                  return false
                }
              }
            }
          } else if (btnType.toLowerCase() === 'cancel') {
            // 响应onCancel事件
            let onCancel = this.onCancel
            if (this.isFunction(onCancel)) {
              if (this.isFalse(onCancel.call(target, e, resultData))) {
                return false
              }
            }
          }

          // 3.最后响应所有按钮的点击事件
          let onButtonClick = this.onButtonClick
          if (this.isFunction(onButtonClick)) {
            if (this.isFalse(onButtonClick.call(target, e, resultData))) {
              return false
            }
          }
        }

        this.close()
      }
    },
    // body点击事件
    bdClickEvent (e) {
      e = e || window.event
      let target = e.target || e.srcElement
      if (this.hasClass(target, 'j-downup-item')) {
        let onDownupItemClick = this.onDownupItemClick
        if (this.isFunction(onDownupItemClick)) {
          let resultData = {
            value: target.getAttribute('data-value'),
            text: target.innerHTML
          }
          var result = onDownupItemClick.call(this, e, resultData)
          if (result !== false && result !== 'false') {
            this.close()
          }
        }
      }
    },
    // 通过类型设置内置按钮
    renderTypeBtn () {
      let type = this.popupType
      if (type === 'alert') {
        this.popupTitle = this.title || '提示'
        this.customButtons = {
          sure: { text: this.sureText || '确定', isVisible: true }
        }
      } else if (type === 'confirm' || type === 'prompt') {
        this.popupTitle = this.title || '确认提示'
        this.customButtons = {
          cancel: { text: this.cancelText || '取消', isVisible: true },
          sure: { text: this.sureText || '确定', isVisible: true }
        }
      } else if (type === 'picker' || this.type === 'picker') {
        this.customButtons = {
          sure: { text: this.sureText || '确定', isVisible: true },
          cancel: { text: this.cancelText || '取消', isVisible: true }
        }
      }
    },
    pickerChange (picker, value, index) {
      this.pickerObject = picker
      if (!value) {
        value = picker.getValues()
      }
      if (this.cityLinkage) {
        let indexValue = value[index]
        if (index === 0) {
          // Province改变，更新city，county
          let city = this.tempProvince[indexValue].city
          let temp1 = []
          let tempThisCity = {}
          this.forEach(city, (item) => {
            temp1.push(item.name)
            tempThisCity[item.name] = item
          })
          this.mockCityData[1].values = temp1
          this.tempCity = tempThisCity

          let temp2 = []
          this.forEach(city[0].county, (item) => {
            temp2.push(item)
          })
          this.mockCityData[2].values = temp2

          picker.setColumnValues(1, temp1)
          picker.setColumnValues(2, temp2)
        } else if (index === 1) {
          // city改变，更新county
          let county = this.tempCity[indexValue].county
          let temp = []
          this.forEach(county, (item) => {
            temp.push(item)
          })
          this.mockCityData[2].values = temp
          picker.setColumnValues(2, temp)
        }
      }
      if (this.onPickerChange) {
        this.onPickerChange.call(picker, value, index)
      }
    },
    /**
     * 城市联动数据
     */
    renderCityMap () {
      if (this.cityLinkage) {
        let cityMapData = this.require(this.city).default
        this.cityMapData = cityMapData
        let tempProvince = {}
        // 省、市、区(县)
        let mockCityData = [{values: []}, {values: []}, {values: []}]
        this.forEach(cityMapData, (cityItem) => {
          mockCityData[0].values.push(cityItem.province)
          tempProvince[cityItem.province] = cityItem
        })
        this.tempProvince = tempProvince

        let tempCity = {}
        this.forEach(cityMapData[0].city, item => {
          mockCityData[1].values.push(item.name)
          tempCity[item.name] = item
        })
        this.tempCity = tempCity

        this.forEach(cityMapData[0].city[0].county, item => {
          mockCityData[2].values.push(item)
        })
        this.mockCityData = mockCityData
      }
    }
  },
  created () {
    this.pickerRef = 'picker-ref-' + (new Date().getTime())
    // 设置初始创建完成直接打开弹出框
    if (this.isTrue(this.initShow)) {
      this.open()
    }
    // 设置自定义标题
    if (this.title && this.title !== 'visible') {
      this.popupTitle = this.title
    }
    // 设置自定义内容
    if (this.content) {
      this.popupContent = this.content
    }
    // 设置自定义消息(内容)
    if (this.message) {
      this.popupContent = this.message
    }
    // downup类型弹出框的选项数据
    if (this.downupData) {
      this.popupDownUpData = this.downupData
    }
    // 设置自定义class
    if (this.className) {
      this.customClass = this.className
    }
    // 设置自定义按钮
    let buttons = this.buttons || this.downupButton
    if (buttons && buttons !== 'visible') {
      let customButtons = this.customButtons
      let button
      let customButton
      let tempButtons
      for (let key in buttons) {
        button = buttons[key]
        customButton = customButtons[key]
        // 如果按钮不存在，直接写入
        if (!customButton) {
          tempButtons = tempButtons || {}
          tempButtons[key] = button
        } else {
          // 如果按钮已存在，直接写入属性
          for (let btnKey in button) {
            customButton[btnKey] = button[btnKey]
          }
          tempButtons = tempButtons || {}
          tempButtons[key] = customButton
        }
      }
      if (tempButtons) {
        this.customButtons = tempButtons
      }
    }
    // 自定义类型
    let type = this.type
    if (type) {
      if (type === 'picker') {
        this.popupType = 'downup'
        // 城市联动数据
        this.renderCityMap()
        if (this.pickerDate) {
          this.pickerDateModel = this.pickerDate
        }
      } else {
        this.popupType = type
      }
      this.renderTypeBtn()
    }
  }
}

export {
  render
}
