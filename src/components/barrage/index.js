/**
 * 弹幕组件 JavaScript
 * @authors AndyPan (pye-mail@163.com)
 * @date    2019年10月29日17:44:21
 */

export default {
  data () {
    return {
      // 弹幕DOM
      barrageDom: null,
      barrageWidth: 0,
      // 当前进行中弹幕
      barrageIn: [],
      // 所有弹幕中空闲数据
      barrageFree: [],
      currentBarrageFree: [],
      // 每行弹幕随机开始时间
      randBeginTime: [1000, 1500, 2000, 2500],
      // 弹幕滚动时间(秒)
      barrageTimer: 16,
      // 记录当前行是否有弹幕，避免重叠
      rowTemplate: {},
      // 运行中的弹幕，当弹幕少于可需要数时，从运行中的弹幕中抽取数据填充
      runingData: {},
      isRun: null
    }
  },
  props: {
    // 弹幕数据
    dataset: { type: Array },
    // 弹幕行数
    barrageRows: { type: Number, default: 4 }
  },
  components: {},
  methods: {
    transition (trans) {
      let styleText = []
      styleText.push('-webkit-transition: ' + trans)
      styleText.push('-moz-transition: ' + trans)
      styleText.push('-o-transition: ' + trans)
      styleText.push('transition: ' + trans)

      return styleText.join(';')
    },
    translate (x) {
      let styleText = []
      styleText.push('-webkit-transform: translate(' + x + ')')
      styleText.push('-moz-transform: translate(' + x + ')')
      styleText.push('-o-transform: translate(' + x + ')')
      styleText.push('-ms-transform: translate(' + x + ')')
      styleText.push('transform: translate(' + x + ')')

      return styleText.join(';')
    },
    /**
     * (向barrageFree中)添加弹幕列表
     * @param {Array} list 添加的弹幕列表
     */
    pushBarrage (list) {
      let len = list.length
      if (list && len) {
        this.forEach(list, item => {
          this.barrageFree.push(item)
        })
      }
      return this
    },
    /**
     * 向当前需要显示的弹幕集合中添加数据(该数据先于barrageFree显示)
     * @param {Array} list 添加的弹幕列表
     */
    pushCurrentBarrage (list) {
      let len = list.length
      if (list && len) {
        this.forEach(list, item => {
          this.barrageFree.unshift(item)
        })
        // console.info(JSON.stringify(this.barrageFree))
        // if (this.barrageFree.length < 7) {
        //   let temp = []
        //   this.forEach(list, item => {
        //     temp.push(item)
        //   })
        //   let switchBullet = () => {
        //     this.forEach(list, item => {
        //       temp.push({ text: item.text, headImg: item.headImg })
        //     })
        //     let len = temp.length
        //     if (len < 7) {
        //       switchBullet()
        //     }
        //   }
        //   switchBullet()
        //   this.barrageFree = temp
        // } else {
        //   this.forEach(list, item => {
        //     this.barrageFree.unshift(item)
        //   })
        // }
      }
      return this
    },
    /**
     * 分发弹幕数据
     */
    dispenseBarrage () {
      let dataset = this.dataset
      if (dataset && dataset.length) {
        this.forEach(dataset, item => {
          this.barrageFree.push(item)
        })
        this.barrageRuning()
      }
      return this
    },
    /**
     * 创建弹幕html
     * @param {*} bItem
     */
    createBarrageHtml (bItem) {
      let html = []
      html.push('<span class="barrage-item">')
      html.push('  <span class="photo-thumb"><img src=' + bItem.headImg + ' class="photo-img" /></span>')
      html.push('  <label class="brrage-text">' + bItem.text + '</label>')
      html.push('</span>')

      let barrageRow = document.createElement('div')
      barrageRow.id = bItem.refs
      barrageRow.setAttribute('class', 'barrage-row ' + bItem.rowClass)
      barrageRow.innerHTML = html.join('\r\n')

      return barrageRow
    },
    /**
     * 添加进行中弹幕
     */
    barrageRuning () {
      if (this.isRun) {
        return
      }
      this.isRun = true
      let barrageRows = this.barrageRows || 3
      let count = 0
      let renderRowBarrage = () => {
        let randBeginTime = this.randBeginTime
        let timeIdx = this.random(0, randBeginTime.length - 1)
        let rowTimer = randBeginTime[timeIdx] || randBeginTime[0]
        setTimeout(() => {
          // console.info(count + ',' + barrageRows)
          // 这里只启动多少行的数值，后续由每一次完了后自动启动
          if (count < barrageRows) {
            createBarrageRow()
            renderRowBarrage()
          }
          count += 1
        }, rowTimer)
      }
      let createBarrageRow = () => {
        let barrageTimer = this.barrageTimer
        let rowTemplate = this.rowTemplate
        // 随机当前弹幕所放行
        let row = this.random(1, barrageRows, (num) => {
          if (rowTemplate[num] === undefined) {
            this.rowTemplate[num] = true
          } else {
            return false
          }
        })
        // 依次取出当前barrageFree中的数据
        let thisBarrageItem = this.barrageFree[0]
        if (!thisBarrageItem) {
          setTimeout(() => {
            createBarrageRow()
          }, barrageTimer)
          // thisBarrageItem = { isCallback: false }
          // let runItem
          // for (let key in this.runingData) {
          //   runItem = this.runingData[key]
          //   if (runItem) {
          //     for (let i in runItem) {
          //       thisBarrageItem[i] = runItem[i]
          //     }
          //     break
          //   }
          // }
          return
        }
        // 保存一个当前运行中的弹幕
        this.runingData[row] = {}
        for (let key in thisBarrageItem) {
          this.runingData[row][key] = thisBarrageItem[key]
        }
        // 从列表中删除当前项
        this.barrageFree.splice(0, 1)
        // 设置显示在第几行
        thisBarrageItem.row = row
        thisBarrageItem.rowClass = 'row-' + row
        let styleText = this.translate('-100%') + (this.transition('transform ' + barrageTimer + 's linear'))
        // 设置ref
        thisBarrageItem.refs = 'j-refs-' + this.getGid()
        // 添加到运行中
        this.barrageIn.push(thisBarrageItem)
        let barrageRowTarget = this.createBarrageHtml(thisBarrageItem)
        this.barrageDom.appendChild(barrageRowTarget)
        this.async((target) => {
          barrageRowTarget.setAttribute('style', styleText)
          let timer = 1000 * barrageTimer
          // 弹幕滚动完成后
          // let end = (target) => {
          //   setTimeout(() => {
          //     // 完成后，还原到列表中
          //     if (thisBarrageItem.isCallback !== false) {
          //       this.barrageFree.push(thisBarrageItem)
          //     }
          //     // 删除当前运行中的数据
          //     this.forEach(this.barrageIn, (item, idx) => {
          //       if (item.refs === thisBarrageItem.refs) {
          //         this.barrageIn.splice(idx, 1)
          //         return 'break'
          //       }
          //     })
          //     target.remove()
          //   }, timer)
          // }
          // end(target)
          // // 弹幕滚动到三分之一时,插入新的弹幕
          // let endBefore = (params) => {
          //   setTimeout(() => {
          //     let item = params.thisBarrageItem
          //     this.rowTemplate[item.row] = undefined
          //     let randBeginTime = this.randBeginTime
          //     let timeIdx = this.random(0, randBeginTime.length - 1)
          //     let rowTimer = randBeginTime[timeIdx] || randBeginTime[0]
          //     setTimeout(() => {
          //       createBarrageRow()
          //     }, rowTimer)
          //   }, timer / 4)
          // }
          // endBefore({target, thisBarrageItem})
          // 弹幕滚动完成后
          this.async((target) => {
            // 完成后，还原到列表中
            if (thisBarrageItem.isCallback !== false) {
              this.barrageFree.push(thisBarrageItem)
            }
            // 删除当前运行中的数据
            this.forEach(this.barrageIn, (item, idx) => {
              if (item.refs === thisBarrageItem.refs) {
                this.barrageIn.splice(idx, 1)
                return 'break'
              }
            })
            target.remove()
          }, timer, target)
          // 弹幕滚动到三分之一时,插入新的弹幕
          this.async((params) => {
            let item = params.thisBarrageItem
            this.rowTemplate[item.row] = undefined
            let randBeginTime = this.randBeginTime
            let timeIdx = this.random(0, randBeginTime.length - 1)
            let rowTimer = randBeginTime[timeIdx] || randBeginTime[0]
            setTimeout(() => {
              createBarrageRow()
            }, rowTimer)
          }, timer / 4, {target, thisBarrageItem})
        }, 100, barrageRowTarget)
      }
      renderRowBarrage()
      return this
    }
  },
  watch: {

  },
  created () {},
  mounted () {
    this.barrageDom = this.$refs['j-ui-barrage']
    this.barrageWidth = this.barrageDom.offsetWidth
    this.dispenseBarrage()
    // setTimeout(() => {
    //   this.pushBarrage([{text: '新增弹幕'}])
    // }, 3000)
  }
}
