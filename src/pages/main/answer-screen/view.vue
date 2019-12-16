<!--
 * 答题游戏大屏 Vue
 * @authors AndyPan (pye-mail@163.com)
 * @date    2019年10月29日16:50:25
-->

<template>
  <div class="page-main-index">
    <div class="game-index-main">
      <div class="game-main-wrap">
        <span class="title-leave" :class="blessingsGradeGame">
          <label>{{blessingsText}}</label>
        </span>
        <div class="title-remark">{{blessingsRemark}}</div>
        <div v-if="gameStatus === 'ing'">
          <!-- 参与人 -->
          <div class="participant">
            <div class="cont-wrap">
              <div class="participant-num-wrap">
                <span class="number">{{activityMemberInfos.length}}</span>
                <span class="list-no-data" v-if="!activityMemberInfos.length"><label>游戏进行中</label></span>
              </div>
            </div>
          </div>
          <div class="participant-list">
            <span  class="participant-list-item" v-for="(item, idx) in activityMemberInfos" :key="idx">
              <img :src="item.headImg" v-if="item.headImg" />
              <label class="placeholder" v-else>{{item.nickName}}</label>
            </span>
          </div>
          <!-- 实时排名 -->
          <div class="real-time-ranking">
            <div class="cont-wrap"></div>
            <span class="list-no-data" v-if="!activityMemberRankingInfos.length"><label>游戏进行中</label></span>
          </div>
          <div class="ranking-list">
            <div v-for="(item, idx) in activityMemberRankingInfos" :key="idx"
              class="ranking-list-item" :class="'item-' + (idx + 1)">
              <span class="item-number">{{((idx + 1) + '').length === 1 ? ('0' + (idx + 1)) : (idx + 1)}}</span>
              <div class="item-cont">
                <span class="item-result">{{item.num}}题/{{item.usedTime}}秒</span>
                <img :src="item.headImg" class="item-photo" v-if="item.headImg" />
                <span class="placeholder" v-else>{{item.nickName}}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="gameStatus === 'end'">
          <div class="game-end-ranking">
            <div class="game-end-cont">
              <div class="game-end-wrap">
                <span class="ranking-before-item ranking-first" v-if="activityMemberRankingInfos[0]">
                  <span class="button-shade"></span>
                  <span class="photo-wrap">
                    <img class="photo-thumb" :src="activityMemberRankingInfos[0].headImg" v-if="activityMemberRankingInfos[0].headImg" />
                    <label class="placeholder" v-else>{{activityMemberRankingInfos[0].nickName}}</label>
                  </span>
                  <span class="ranking-cont">{{activityMemberRankingInfos[0].num}}题/ {{activityMemberRankingInfos[0].usedTime}}秒</span>
                  <label class="nick-name">{{activityMemberRankingInfos[0].nickName || nickNamePH}}</label>
                </span>
                <span class="ranking-before-item ranking-second" v-if="activityMemberRankingInfos[1]">
                  <span class="button-shade"></span>
                  <span class="photo-wrap">
                    <img class="photo-thumb" :src="activityMemberRankingInfos[1].headImg" v-if="activityMemberRankingInfos[1].headImg" />
                    <label class="placeholder" v-else>{{activityMemberRankingInfos[1].nickName}}</label>
                  </span>
                  <span class="ranking-cont">{{activityMemberRankingInfos[1].num}}题/ {{activityMemberRankingInfos[1].usedTime}}秒</span>
                  <label class="nick-name">{{activityMemberRankingInfos[1].nickName || nickNamePH}}</label>
                </span>
                <span class="ranking-before-item ranking-third" v-if="activityMemberRankingInfos[2]">
                  <span class="button-shade"></span>
                  <span class="photo-wrap">
                    <img class="photo-thumb" :src="activityMemberRankingInfos[2].headImg" v-if="activityMemberRankingInfos[2].headImg" />
                    <label class="placeholder" v-else>{{activityMemberRankingInfos[2].nickName}}</label>
                  </span>
                  <span class="ranking-cont">{{activityMemberRankingInfos[2].num}}题/ {{activityMemberRankingInfos[2].usedTime}}秒</span>
                  <label class="nick-name">{{activityMemberRankingInfos[2].nickName || nickNamePH}}</label>
                </span>
                <div class="ranking-other-wrap">
                  <span class="ranking-other-item"
                    v-for="(item, idx) in activityMemberRankingInfos" :key="idx"
                    v-if="idx > 2">
                    <label class="ranking-number">{{idx + 1}}</label>
                    <img class="photo-thumb" :src="item.headImg" v-if="item.headImg" />
                    <label class="placeholder" v-else>{{item.nickName}}</label>
                    <label class="nick-name">{{item.nickName}}</label>
                    <label class="ranking-cont">{{item.num}}题/ {{item.usedTime}}秒</label>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="game-main-bg">
        <img class="game-title" src="../../../assets/images/background/bg-game-title.png" />
        <span class="icon-lantern left"></span>
        <span class="icon-lantern right"></span>
        <span class="icon-modification-left"></span>
        <span class="icon-lion-head"></span>
        <span class="icon-sector-1"></span>
        <span class="icon-sector-2"></span>
        <span class="icon-sector-3"></span>
        <a href="javascript:;" class="button-reset j-button-reset" v-if="gameStatus === 'end'">返回</a>
      </div>
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
