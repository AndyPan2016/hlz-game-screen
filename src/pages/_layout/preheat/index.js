/**
 * 预热页
 * @authors AndyPan (pye-mail@163.com)
 * @date    2019年10月28日14:28:05
 */

let { LANG } = Configs.require()

export default {
  data () {
    return {
      rationClass: null,
      // 计算属性（宽、高）
      computeAttr: {}
    }
  },
  methods: {
    renderComponent () {
      let page = this.params('page') || PagesPreheat.index
      this.currentComponent = PagesPreheat.use(page)
    },
    transformScale (w, h) {
      let styleText = []
      styleText.push('-webkit-transform: scale(#scaleW#, #scaleH#)'.replace('#scaleW#', w).replace('#scaleH#', h))
      styleText.push('-moz-transform: scale(#scaleW#, #scaleH#)'.replace('#scaleW#', w).replace('#scaleH#', h))
      styleText.push('-o-transform: scale(#scaleW#, #scaleH#)'.replace('#scaleW#', w).replace('#scaleH#', h))
      styleText.push('-ms-transform: scale(#scaleW#, #scaleH#)'.replace('#scaleW#', w).replace('#scaleH#', h))
      styleText.push('transform: scale(#scaleW#, #scaleH#)'.replace('#scaleW#', w).replace('#scaleH#', h))

      return styleText.join(';')
    },
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
      // console.info(configRatio)
      /** 以当前最适合的比例展示(计算当前最适合的比例) **/
      // console.info(winWidth + ',' + winHeight)
      if (winWidth > winHeight) {
        attrHeight = winHeight
        attrWidth = winHeight * configRatio
        // console.info(attrWidth > winWidth)
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
        this.rationClass = attrRatioConfig.class
      }
      // console.info(attrWidth + ',' + attrHeight)
      // console.info(attrRatioConfig.width + ',' + attrRatioConfig.height)
      let scaleRatioW = attrWidth / attrRatioConfig.width
      let scaleRatioH = attrHeight / attrRatioConfig.height
      // console.info(scaleRatioW + ',' + scaleRatioH)
      let styleText = this.transformScale(scaleRatioW, scaleRatioH)
      // console.info(styleText)
      this.computeAttr.styleText = styleText

      // this.computeAttr.height = attrHeight
      // this.computeAttr.width = attrWidth
      // this.computeAttr.styleText = (attrHeight ? ('height: ' + attrHeight + 'px;') : '') +
      //   (attrWidth ? ('width: ' + attrWidth + 'px;') : '') +
      //   (attrHeight ? ('margin-top: ' + (-attrHeight / 2) + 'px;') : '') +
      //   (attrWidth ? ('margin-left: ' + (-attrWidth / 2) + 'px;') : '')
      // }
    }
  },
  components: {},
  watch: {
    '$route' () {
      this.renderComponent()
    }
  },
  created () {
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
