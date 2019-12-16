/**
 * 答题游戏大屏
 * @authors AndyPan (pye-mail@163.com)
 * @date    2019年10月29日16:49:32
 */

import { mapState } from 'vuex'

export default {
  data () {
    return {
      // 参数集合
      pageParams: null,
      pageQuery: null,
      // 昵称占位
      nickNamePH: '无'
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
    })
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
    // 设置为答题游戏类型
    this.$store.dispatch('activityInfoStoreUpdate', { projectionGameType: 'ANSWER_GAME' })
  }
}
