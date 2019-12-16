/**
 * 数钱游戏大屏 业务逻辑JS
 * @authors AndyPan (pye-mail@163.com)
 * @date    2019年11月20日20:40:21
 */

import { mapState } from 'vuex'

export default {
  data () {
    return {
      // 飘落动画项
      moneyFallingList: [
        {id: 0, animation: ''},
        {id: 1, animation: ''},
        {id: 2, animation: ''},
        {id: 3, animation: ''},
        {id: 4, animation: ''},
        {id: 5, animation: ''}
      ],
      // 用于随机去设置动画名称
      moneyFallingAnimation: [
        {key: 1, animation: 'falling-start-1', timer: 5},
        {key: 2, animation: 'falling-start-2', timer: 5},
        {key: 3, animation: 'falling-start-3', timer: 3},
        {key: 4, animation: 'falling-start-4', timer: 4},
        {key: 5, animation: 'falling-start-5', timer: 3},
        {key: 6, animation: 'falling-start-6', timer: 5}
      ],
      // 参数集合
      pageParams: null,
      pageQuery: null,
      // 昵称占位
      nickNamePH: '无',
      // 排行榜柱状图最大高度
      rankMax: 185,
      // 排行榜柱状图最小高度
      rankMin: 15,
      // 排行榜柱状图最大数值
      rankRate: 30000
    }
  },
  // 属性计算
  computed: {
    ...mapState({
      // 祝福语等级样式
      blessingsGradeGame: state => state.ActivityInfoStore.blessingsGradeGame,
      // 祝福语
      blessingsText: state => state.ActivityInfoStore.blessingsText,
      // 祝福语备注
      blessingsRemark: state => state.ActivityInfoStore.blessingsRemark,
      // 游戏状态
      gameStatus: state => state.ActivityInfoStore.gameStatus,
      // 游戏成员加入列表
      activityMemberInfos: state => state.ActivityJoinStore.activityMemberInfos,
      // 游戏排行榜
      activityMemberRankingInfos: state => state.ActivityRankStore.activityMemberRankingInfos
    }),
    /**
     * 计算排行榜柱状图高度
     */
    rankRateValue () {
      return (rankItem) => {
        rankItem = rankItem || {}
        let number = (rankItem.num || 0) * 100
        let rankH = (number / this.rankRate) * this.rankMax
        rankH = rankH < this.rankMin ? this.rankMin : rankH
        rankH = rankH > this.rankMax ? this.rankMax : rankH
        return rankH || this.rankMin
      }
    },
    /**
     * 数钱张数 * 100
     */
    moneyNumber () {
      return (number) => {
        return number * 100
      }
    }
  },
  // (自定义)方法
  methods: {
    /**
     * 钱飘落启动, 随机
     */
    moneyFalling () {
      // 飘落动画项
      let moneyFallingList = this.moneyFallingList
      // 用于随机去设置动画名称
      let moneyFallingAnimation = this.moneyFallingAnimation
      let animationLen = moneyFallingAnimation.length

      let that = this
      let eachFn = (listItem, animationItem) => {
        let thisListItem = that.moneyFallingList[listItem.id]
        thisListItem.animation = animationItem.animation
        setTimeout(() => {
          let resNumber = Math.floor(Math.random() * animationLen)
          eachFn(thisListItem, moneyFallingAnimation[resNumber])
        }, animationItem.timer * 1000)
      }

      for (let i = 0, len = moneyFallingList.length; i < len; i++) {
        eachFn(moneyFallingList[i], moneyFallingAnimation[i])
      }
    }
  },
  /**
   * 模板编译前，组件创建完成
   */
  created () {
    let params = this.params()
    params.body = this.transfToJson(params.body)
    this.pageParams = params
    this.pageQuery = window.location.href.split('?')[1]
    // 设置当前state为显示星星
    this.$store.dispatch('starStoreUpdate', { isRenderStar: true })
    // 设置为数钱游戏类型
    this.$store.dispatch('activityInfoStoreUpdate', { projectionGameType: 'COUNT_NUM' })
  },
  /**
   * 模板渲染完成(模板渲染成html)
   */
  mounted () {
    this.moneyFalling()
  }
}
