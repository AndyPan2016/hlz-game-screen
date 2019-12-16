<!--
 * 数钱大屏 Vue
 * @authors AndyPan (pye-mail@163.com)
 * @date    2019年11月20日20:39:58
-->

<template>
  <div class="page-main-index">
    <div class="money-falling">
        <i v-for="(item, idx) in moneyFallingList"
            :class="'money-falling-item ' + (item.animation)"
            :key="idx"></i>
    </div>
    <div class="page-countmoney-title"></div>
    <div class="page-countmoney-frame" id="star">
        <div class="countmoney-title" :class="blessingsGradeGame">{{blessingsText}}</div>
        <div class="countmoney-protagonist">
            <span>{{blessingsRemark}}</span>
        </div>
        <div class="countmoney-wing"></div>
        <!-- 游戏进行中 -->
        <div class="countmoney-content" v-if="gameStatus === 'ing'">
            <div class="content-item">
                <div class="gamejoin-number">{{activityMemberInfos.length || '0'}}</div>
                <div class="gamejoin-avatar">
                    <p v-for="(item, idx) in activityMemberInfos"
                        :key="idx">
                        <img class="game-title" :src="item.headImg" v-if="item.headImg" />
                        <label class="placeholder" v-else>{{item.nickName}}</label>
                    </p>
                </div>
            </div>
            <div class="content-item gamerank">
                <div class="gamerank-title"></div>
                <span class="countmoney-ing" v-if="!activityMemberRankingInfos || !activityMemberRankingInfos.length"></span>
                <div class="gamerank-data">
                    <div class="rank-item">
                        <div class="rank-item-wrap">
                            <p class="avatar" v-if="activityMemberRankingInfos[0]">
                                <img class="game-title" :src="activityMemberRankingInfos[0].headImg" v-if="activityMemberRankingInfos[0].headImg" />
                                <label class="placeholder" v-else>{{activityMemberRankingInfos[0].nickName}}</label>
                            </p>
                            <p class="name" v-if="activityMemberRankingInfos[0]">{{activityMemberRankingInfos[0].nickName || '-'}}</p>
                            <p class="result" v-if="activityMemberRankingInfos[0]">{{moneyNumber(activityMemberRankingInfos[0].num || 0)}}</p>
                            <p class="bar" :style="'height: ' + (rankRateValue(activityMemberRankingInfos[0])) + 'px;'"></p>
                            <p class="ranking">第一名</p>
                        </div>
                    </div>
                    <div class="rank-item">
                        <div class="rank-item-wrap">
                            <p class="avatar" v-if="activityMemberRankingInfos[1]">
                                <img class="game-title" :src="activityMemberRankingInfos[1].headImg" v-if="activityMemberRankingInfos[1].headImg" />
                                <label class="placeholder" v-else>{{activityMemberRankingInfos[1].nickName}}</label>
                            </p>
                            <p class="name" v-if="activityMemberRankingInfos[1]">{{activityMemberRankingInfos[1].nickName || '-'}}</p>
                            <p class="result" v-if="activityMemberRankingInfos[1]">{{moneyNumber(activityMemberRankingInfos[1].num || 0)}}</p>
                            <p class="bar" :style="'height: ' + (rankRateValue(activityMemberRankingInfos[1])) + 'px;'"></p>
                            <p class="ranking">第二名</p>
                        </div>
                    </div>
                    <div class="rank-item">
                        <div class="rank-item-wrap">
                            <p class="avatar" v-if="activityMemberRankingInfos[2]">
                                <img class="game-title" :src="activityMemberRankingInfos[2].headImg" v-if="activityMemberRankingInfos[2].headImg" />
                                <label class="placeholder" v-else>{{activityMemberRankingInfos[2].nickName}}</label>
                            </p>
                            <p class="name" v-if="activityMemberRankingInfos[2]">{{activityMemberRankingInfos[2].nickName || '-'}}</p>
                            <p class="result" v-if="activityMemberRankingInfos[2]">{{moneyNumber(activityMemberRankingInfos[2].num || 0)}}</p>
                            <p class="bar" :style="'height: ' + (rankRateValue(activityMemberRankingInfos[2])) + 'px;'"></p>
                            <p class="ranking">第三名</p>
                        </div>
                    </div>
                    <div class="rank-item">
                        <div class="rank-item-wrap">
                            <p class="avatar" v-if="activityMemberRankingInfos[3]">
                                <img class="game-title" :src="activityMemberRankingInfos[3].headImg" v-if="activityMemberRankingInfos[3].headImg" />
                                <label class="placeholder" v-else>{{activityMemberRankingInfos[3].nickName}}</label>
                            </p>
                            <p class="name" v-if="activityMemberRankingInfos[3]">{{activityMemberRankingInfos[3].nickName || '-'}}</p>
                            <p class="result" v-if="activityMemberRankingInfos[3]">{{moneyNumber(activityMemberRankingInfos[3].num || 0)}}</p>
                            <p class="bar" :style="'height: ' + (rankRateValue(activityMemberRankingInfos[3])) + 'px;'"></p>
                            <p class="ranking">第四名</p>
                        </div>
                    </div>
                    <div class="rank-item">
                        <div class="rank-item-wrap">
                            <p class="avatar" v-if="activityMemberRankingInfos[4]">
                                <img class="game-title" :src="activityMemberRankingInfos[4].headImg" v-if="activityMemberRankingInfos[4].headImg" />
                                <label class="placeholder" v-else>{{activityMemberRankingInfos[4].nickName}}</label>
                            </p>
                            <p class="name" v-if="activityMemberRankingInfos[4]">{{activityMemberRankingInfos[4].nickName || '-'}}</p>
                            <p class="result" v-if="activityMemberRankingInfos[4]">{{moneyNumber(activityMemberRankingInfos[4].num || 0)}}</p>
                            <p class="bar" :style="'height: ' + (rankRateValue(activityMemberRankingInfos[4])) + 'px;'"></p>
                            <p class="ranking">第五名</p>
                        </div>
                    </div>
                    <div class="rank-item">
                        <div class="rank-item-wrap">
                            <p class="avatar" v-if="activityMemberRankingInfos[5]">
                                <img class="game-title" :src="activityMemberRankingInfos[5].headImg" v-if="activityMemberRankingInfos[5].headImg" />
                                <label class="placeholder" v-else>{{activityMemberRankingInfos[5].nickName}}</label>
                            </p>
                            <p class="name" v-if="activityMemberRankingInfos[5]">{{activityMemberRankingInfos[5].nickName || '-'}}</p>
                            <p class="result" v-if="activityMemberRankingInfos[5]">{{moneyNumber(activityMemberRankingInfos[5].num || 0)}}</p>
                            <p class="bar" :style="'height: ' + (rankRateValue(activityMemberRankingInfos[5])) + 'px;'"></p>
                            <p class="ranking">第六名</p>
                        </div>
                    </div>
                    <div class="rank-item">
                        <div class="rank-item-wrap">
                            <p class="avatar" v-if="activityMemberRankingInfos[6]">
                                <img class="game-title" :src="activityMemberRankingInfos[6].headImg" v-if="activityMemberRankingInfos[6].headImg" />
                                <label class="placeholder" v-else>{{activityMemberRankingInfos[6].nickName}}</label>
                            </p>
                            <p class="name" v-if="activityMemberRankingInfos[6]">{{activityMemberRankingInfos[6].nickName || '-'}}</p>
                            <p class="result" v-if="activityMemberRankingInfos[6]">{{moneyNumber(activityMemberRankingInfos[6].num || 0)}}</p>
                            <p class="bar" :style="'height: ' + (rankRateValue(activityMemberRankingInfos[6])) + 'px;'"></p>
                            <p class="ranking">第七名</p>
                        </div>
                    </div>
                    <div class="rank-item">
                        <div class="rank-item-wrap">
                            <p class="avatar" v-if="activityMemberRankingInfos[7]">
                                <img class="game-title" :src="activityMemberRankingInfos[7].headImg" v-if="activityMemberRankingInfos[7].headImg" />
                                <label class="placeholder" v-else>{{activityMemberRankingInfos[7].nickName}}</label>
                            </p>
                            <p class="name" v-if="activityMemberRankingInfos[7]">{{activityMemberRankingInfos[7].nickName || '-'}}</p>
                            <p class="result" v-if="activityMemberRankingInfos[7]">{{moneyNumber(activityMemberRankingInfos[7].num || 0)}}</p>
                            <p class="bar" :style="'height: ' + (rankRateValue(activityMemberRankingInfos[7])) + 'px;'"></p>
                            <p class="ranking">第八名</p>
                        </div>
                    </div>
                    <div class="rank-item">
                        <div class="rank-item-wrap">
                            <p class="avatar" v-if="activityMemberRankingInfos[8]">
                                <img class="game-title" :src="activityMemberRankingInfos[8].headImg" v-if="activityMemberRankingInfos[8].headImg" />
                                <label class="placeholder" v-else>{{activityMemberRankingInfos[8].nickName}}</label>
                            </p>
                            <p class="name" v-if="activityMemberRankingInfos[8]">{{activityMemberRankingInfos[8].nickName || '-'}}</p>
                            <p class="result" v-if="activityMemberRankingInfos[8]">{{moneyNumber(activityMemberRankingInfos[8].num || 0)}}</p>
                            <!-- <p class="bar" :style="'height:' + rankMin + 'px;'"></p> -->
                            <p class="bar" :style="'height: ' + (rankRateValue(activityMemberRankingInfos[8])) + 'px;'"></p>
                            <p class="ranking">第九名</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 游戏结束 -->
        <div class="countmoney-result" v-if="gameStatus === 'end'">
            <span class="countmoney-result-title"></span>
            <a href="javascript:;" class="button-reset j-button-reset">返回</a>
            <div class="rank-last-wrap">
                <span class="rank-last-item rank-last-first">
                    <span class="rank-thumb-wrap" v-if="activityMemberRankingInfos[0]">
                        <span class="button-shade"></span>
                        <span class="photo-wrap">
                            <img class="photo-thumb" :src="activityMemberRankingInfos[0].headImg" v-if="activityMemberRankingInfos[0].headImg" />
                            <label class="placeholder" v-else>{{activityMemberRankingInfos[0].nickName}}</label>
                        </span>
                        <span class="ranking-cont">{{moneyNumber(activityMemberRankingInfos[0].num)}}</span>
                        <label class="nick-name">{{activityMemberRankingInfos[0].nickName || nickNamePH}}</label>
                    </span>
                </span>
                <span class="rank-last-item rank-last-second">
                    <span class="rank-thumb-wrap" v-if="activityMemberRankingInfos[1]">
                        <span class="button-shade"></span>
                        <span class="photo-wrap">
                            <img class="photo-thumb" :src="activityMemberRankingInfos[1].headImg" v-if="activityMemberRankingInfos[1].headImg" />
                            <label class="placeholder" v-else>{{activityMemberRankingInfos[1].nickName}}</label>
                        </span>
                        <span class="ranking-cont">{{moneyNumber(activityMemberRankingInfos[1].num)}}</span>
                        <label class="nick-name">{{activityMemberRankingInfos[1].nickName || nickNamePH}}</label>
                    </span>
                </span>
                <span class="rank-last-item rank-last-third">
                    <span class="rank-thumb-wrap" v-if="activityMemberRankingInfos[2]">
                        <span class="button-shade"></span>
                        <span class="photo-wrap">
                            <img class="photo-thumb" :src="activityMemberRankingInfos[2].headImg" v-if="activityMemberRankingInfos[2].headImg" />
                            <label class="placeholder" v-else>{{activityMemberRankingInfos[2].nickName}}</label>
                        </span>
                        <span class="ranking-cont">{{moneyNumber(activityMemberRankingInfos[2].num)}}</span>
                        <label class="nick-name">{{activityMemberRankingInfos[2].nickName || nickNamePH}}</label>
                    </span>
                </span>
                <div class="rank-last-other-shadow"></div>
                <div class="rank-last-other">
                    <span class="rank-other-item"
                        v-for="(item, idx) in activityMemberRankingInfos"
                        :key="idx"
                        v-if="idx > 2">
                        <label class="rank-index">{{idx + 1}}</label>
                        <img :src="item.headImg" class="rank-photo-thumb" v-if="item.headImg" />
                        <label class="placeholder" v-else>{{item.nickName}}</label>
                        <label class="rank-last-nickname">{{item.nickName}}</label>
                        <label class="redpacket-rank-money">{{moneyNumber(item.num)}}</label>
                    </span>
                </div>
            </div>
        </div>
        <i class="icon-gold-1"></i>
        <i class="icon-gold-2"></i>
        <i class="icon-gold-3"></i>
    </div>
  </div>
</template>

<script>
import render from './index.js'
export default render
</script>
<style lang="less">
@import './view.less';
</style>
