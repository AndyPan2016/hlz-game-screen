<!--
 * 摇一摇红包大屏 Vue
 * @authors AndyPan (pye-mail@163.com)
 * @date    2019年11月19日17:51:30
-->

<template>
  <div class="page-main-index">
    <div class="game-main-cloud"></div>
    <div class="redpacket-gametitle" :class="blessingsGradeGame">
      <span>{{blessingsText}}</span>
    </div>
    <div class="game-main-wrap">
      <div class="redpacket-gametitle-remark">{{blessingsRemark}}</div>
      <!-- 游戏进行中 -->
      <div v-if="gameStatus === 'ing'">
        <div class="redpacket-cont-item redpacket-item-join">
          <span class="join-number">{{activityMemberInfos.length}}</span>
          <div class="joinlist-cont">
            <span class="list-no" v-if="!activityMemberInfos || !activityMemberInfos.length"></span>
            <span class="user-thumb"
              v-for="(item, idx) in activityMemberInfos"
              :key="idx">
                <img :src="item.headImg" v-if="item.headImg" />
                <label class="placeholder" v-else>{{item.nickName}}</label>
              </span>
            <!-- <img class="user-thumb"
              v-for="(item, idx) in activityMemberInfos"
              :key="idx"
              :src="item.headImg"/> -->
          </div>
        </div>
        <div class="redpacket-surplus">
          <label class="redpacket-top">还剩</label>
          <span class="redpacket-bg animation-tada">{{surplusRedPackNum || 0}}</span>
          <label class="redpacket-bottom">红包</label>
        </div>
        <div class="redpacket-cont-item redpacket-item-rank">
          <div class="ranklist-cont">
            <span class="list-no" v-if="!activityMemberRankingInfos || !activityMemberRankingInfos.length"></span>
            <span class="rank-item"
              v-for="(item, idx) in activityMemberRankingInfos"
              :key="idx"
              :class="'rank-' + (idx + 1)">
              <label class="item-index">{{idx + 1}}</label>
              <span class="item-cont">
                <img :src="item.headImg" class="rank-thumb" v-if="item.headImg" />
                <label class="placeholder" v-else>{{item.nickName}}</label>
                <label class="rank-nickname">{{item.nickName}}</label>
                <label class="rank-money">{{userMoney(item.num)}}元</label>
              </span>
            </span>
          </div>
        </div>
      </div>
      <!-- 游戏结束 -->
      <div v-if="gameStatus === 'end'">
        <div class="redpacket-rank-last">
          <div class="rank-last-wrap">
            <span class="rank-last-item rank-last-first">
              <span class="rank-thumb-wrap" v-if="activityMemberRankingInfos[0]">
                <span class="thumb-wrap">
                  <img :src="activityMemberRankingInfos[0].headImg" class="photo-thumb" v-if="activityMemberRankingInfos[0].headImg" />
                  <label class="placeholder" v-else>{{activityMemberRankingInfos[0].nickName}}</label>
                  <label class="redpacket-rank-money">{{userMoney(activityMemberRankingInfos[0].num)}}元</label>
                </span>
                <label class="rank-last-nickname">{{activityMemberRankingInfos[0].nickName}}</label>
              </span>
            </span>
            <span class="rank-last-item rank-last-second">
              <span class="rank-thumb-wrap" v-if="activityMemberRankingInfos[1]">
                <span class="thumb-wrap">
                  <img :src="activityMemberRankingInfos[1].headImg" class="photo-thumb" v-if="activityMemberRankingInfos[1].headImg" />
                  <label class="placeholder" v-else>{{activityMemberRankingInfos[1].nickName}}</label>
                  <label class="redpacket-rank-money">{{userMoney(activityMemberRankingInfos[1].num)}}元</label>
                </span>
                <label class="rank-last-nickname">{{activityMemberRankingInfos[1].nickName}}</label>
              </span>
            </span>
            <span class="rank-last-item rank-last-third">
              <span class="rank-thumb-wrap" v-if="activityMemberRankingInfos[2]">
                <span class="thumb-wrap">
                  <img :src="activityMemberRankingInfos[2].headImg" class="photo-thumb" v-if="activityMemberRankingInfos[2].headImg" />
                  <label class="placeholder" v-else>{{activityMemberRankingInfos[2].nickName}}</label>
                  <label class="redpacket-rank-money">{{userMoney(activityMemberRankingInfos[2].num)}}元</label>
                </span>
                <label class="rank-last-nickname">{{activityMemberRankingInfos[2].nickName}}</label>
              </span>
            </span>
            <div class="rank-last-other">
              <span class="rank-other-item"
                v-for="(item, idx) in activityMemberRankingInfos"
                :key="idx"
                v-if="idx > 2">
                <label class="rank-index">{{idx + 1}}</label>
                <img :src="item.headImg" class="rank-photo-thumb" v-if="item.headImg" />
                <label class="placeholder" v-else>{{item.nickName}}</label>
                <label class="rank-last-nickname">{{item.nickName}}</label>
                <label class="redpacket-rank-money">{{userMoney(item.num)}}元</label>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="game-main-bg"></div>
    <a href="javascript:;" class="btn-reset j-button-reset" v-if="gameStatus === 'end'">返回</a>
  </div>
</template>

<script>
import render from './index.js'
export default render
</script>
<style lang="less">
@import './view.less';
</style>
