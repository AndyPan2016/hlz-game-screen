/**
 * 摇一摇红包大屏
 * @authors AndyPan (pye-mail@163.com)
 * @date    2019年11月19日17:50:57
 */

import { mapState } from 'vuex'

export default {
  data () {
    return {
      // 参数集合
      pageParams: null,
      pageQuery: null,
      // 昵称占位
      nickNamePH: '无',
      // 红包游戏数据
      redPackInfo: {},
      // 游戏信息socket
      gameInfoWebSocket: null
    }
  },
  // 属性计算
  computed: {
    ...mapState({
      // 祝福语等级样式
      blessingsGradeGame: state => state.ActivityInfoStore.blessingsGradeGame,
      // 红包游戏的红包剩余数
      surplusRedPackNum: state => state.ActivityInfoStore.surplusRedPackNum,
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
     * 金额转换
     * @param {*} money 金额，分
     */
    userMoney () {
      return (money) => {
        return this.transferMoney(money)
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
    this.$store.dispatch('starStoreUpdate', { isRenderStar: false })
    // 设置为红包游戏类型
    this.$store.dispatch('activityInfoStoreUpdate', { projectionGameType: 'RED_PACK' })
  }
}
