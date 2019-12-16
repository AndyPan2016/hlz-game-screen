/**
 * 文本及状态配置
 * @author AndyPan
 * @createdate 2019年10月28日14:09:07
 * @lastupdatedate 2019年10月28日14:09:11
 * @remark 通用提示文本等
 */

export default {
  // 空文本
  placeholderText: '无',
  // 屏幕比配置
  screenRation: {
    // 16 : 9 (1.78)
    '1.78': { class: 'sceen-ratio-16-9', ratio: 1.78, width: 1920, height: 1080 },
    // 16 : 10 (1.60)
    '1.60': { class: 'sceen-ratio-16-10', ratio: 1.60, width: 1920, height: 1200 },
    // 4 : 3 (1.33)
    '1.33': { class: 'sceen-ratio-4-3', ratio: 1.33, width: 1440, height: 1080 },
    // 其他比例
    'other': { class: 'sceen-ratio-other', ratio: 1.78, width: 1920, height: 1080 }
  },
  activityStatusFormatScreen: {
    // 没有游戏，或者游戏未开始
    'INIT': { key: 'INIT', formatScreen: false },
    // 主持人点击开始后(游戏开始前倒计时开始)
    'DOING': { key: 'DOING', formatScreen: 'doing' },
    // 主持人点结束后
    'FINISH': { key: 'FINISH', formatScreen: 'end' }
  },
  projectionGameTypeScreen: {
    // 答题大屏
    'ANSWER_GAME': { path: PagesMain.router(PagesMain.answerScreen) },
    // 摇一摇红包大屏
    'RED_PACK': { path: PagesMain.router(PagesMain.redPacketScreen) },
    // 数钱大屏
    'COUNT_NUM': { path: PagesMain.router(PagesMain.countMoneyScreen) }
  }
}
