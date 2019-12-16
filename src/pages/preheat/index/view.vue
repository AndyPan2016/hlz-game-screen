<!--
 * 预热页 Vue
 * @authors AndyPan (pye-mail@163.com)
 * @date    2019年10月28日16:50:25
-->

<template>
  <div class="page-preheat-index">
    <div class="preheat-index-main" v-if="!gameStart">
      <!-- <img class="preheat-thumb" v-if="preheatThumb" :src="preheatThumb.picture" @load="preheatThumbLoad" /> -->
      <div class="thumb-wrap" v-if="activityInit">
        <!-- (优先)视频 -->
        <div class="preheat-thumb" v-if="activityInitInfo.videoList && activityInitInfo.videoList.length > 0">
          <video class="preheat-video" :src="activityInitInfo.videoList[0].picture" autoplay loop controls="false" width="100%"></video>
        </div>
        <!-- (其次)图片 -->
        <div class="preheat-thumb" v-else-if="activityInitInfo.pictureList && activityInitInfo.pictureList.length > 0">
          <span class="picture-thumb-wrap"
            v-for="(item, idx) in activityInitInfo.pictureList"
            :key="idx"
            :class="item.active">
            <img class="picture-thumb" @load="preheatThumbLoad" :src="item.picture" />
          </span>
        </div>
        <!-- (最后)默认占位 -->
        <div class="preheat-thumb-no" v-else>
          <i class="ph-round left-top"></i>
          <i class="ph-round left-bottom"></i>
          <i class="ph-round right-top"></i>
          <i class="ph-round right-bottom"></i>
        </div>
      </div>
      <div class="blessings-wrap" :class="blessingsGrade">
        <div class="blessings-text">{{blessingsText}}</div>
        <div class="blessings-remark">{{blessingsRemark}}</div>
      </div>
      <div class="count-down-wrap" v-if="gameBeginInAMinute">
      <!-- <div class="count-down-wrap"> -->
        <div class="game-entry-tip">
          <div class="tip-count-down" :class="gameBeginCountDownClass">
            <span class="cd-tip-message">游戏开始，正在进入...</span>
          </div>
        </div>
      </div>
      <div class="activity-qrcode-wrap">
        <span class="qrcode-wrap">
          <img :src="qrCode" class="qrcode-thumb" />
        </span>
        <span class="qrcode-text-wrap">
          <label class="qrcode-text">扫一扫加入游戏</label>
        </span>
      </div>
      <!-- 弹幕 -->
      <barrage :dataset="barrageDataSet" ref="my-barrage" />
    </div>
    <div class="game-index-main" v-else>
      <div class="game-main-wrap">
        <img class="game-title" src="../../../assets/images/background/bg-game-title.png" />
        <span class="icon-lantern left"></span>
        <span class="icon-lantern right"></span>
        <span class="icon-modification-left"></span>
        <span class="icon-lion-head"></span>
        <span class="icon-sector-1"></span>
        <span class="icon-sector-2"></span>
        <span class="icon-sector-3"></span>
        <span class="title-leave" :class="blessingsGradeGame">
          <label>{{blessingsText}}</label>
        </span>
        <div class="title-remark">{{blessingsRemark}}</div>
        <div v-if="gameStart === 'ing'">
          <!-- 参与人 -->
          <div class="participant">
            <div class="cont-wrap">
              <div class="participant-num-wrap">
                <span class="number">{{activityMemberInfos.length}}</span>
                <span class="list-no-data" v-if="!activityMemberInfos.length">游戏进行中...</span>
              </div>
            </div>
          </div>
          <div class="participant-list">
            <img v-for="(item, idx) in activityMemberInfos" :key="idx" :src="item.headImg || 'test'" :alt="item.nickName || nickNamePH" class="participant-list-item" />
          </div>
          <!-- 实时排名 -->
          <div class="real-time-ranking">
            <div class="cont-wrap"></div>
            <span class="list-no-data" v-if="!activityMemberRankingInfos.length">游戏进行中...</span>
          </div>
          <div class="ranking-list">
            <div v-for="(item, idx) in activityMemberRankingInfos" :key="idx"
              class="ranking-list-item" :class="'item-' + (idx + 1)">
              <span class="item-number">{{(idx + '').length === 1 ? ('0' + (idx + 1)) : (idx + 1)}}</span>
              <div class="item-cont">
                <span class="item-result">{{item.num}}题/{{item.usedTime}}秒</span>
                <img :src="item.headImg || 'test'" class="item-photo" :alt="item.nickName || nickNamePH" />
              </div>
            </div>
          </div>
        </div>
        <div v-if="gameStart === 'end'">
          <div class="game-end-ranking">
            <div class="game-end-cont">
              <div class="game-end-wrap">
                <span class="ranking-before-item ranking-first" v-if="activityMemberRankingInfos[0]">
                  <span class="button-shade"></span>
                  <span class="photo-wrap">
                    <img class="photo-thumb" :src="activityMemberRankingInfos[0].headImg || 'test'"
                      :alt="activityMemberRankingInfos[0].nickName || nickNamePH" />
                  </span>
                  <span class="ranking-cont">{{activityMemberRankingInfos[0].num}}题/ {{activityMemberRankingInfos[0].usedTime}}秒</span>
                  <label class="nick-name">{{activityMemberRankingInfos[0].nickName || nickNamePH}}</label>
                </span>
                <span class="ranking-before-item ranking-second" v-if="activityMemberRankingInfos[1]">
                  <span class="button-shade"></span>
                  <span class="photo-wrap">
                    <img class="photo-thumb" :src="activityMemberRankingInfos[1].headImg || 'test'"
                      :alt="activityMemberRankingInfos[1].nickName || nickNamePH" />
                  </span>
                  <span class="ranking-cont">{{activityMemberRankingInfos[1].num}}题/ {{activityMemberRankingInfos[1].usedTime}}秒</span>
                  <label class="nick-name">{{activityMemberRankingInfos[1].nickName || nickNamePH}}</label>
                </span>
                <span class="ranking-before-item ranking-third" v-if="activityMemberRankingInfos[2]">
                  <span class="button-shade"></span>
                  <span class="photo-wrap">
                    <img class="photo-thumb" :src="activityMemberRankingInfos[2].headImg || 'test'"
                      :alt="activityMemberRankingInfos[2].nickName || nickNamePH" />
                  </span>
                  <span class="ranking-cont">{{activityMemberRankingInfos[2].num}}题/ {{activityMemberRankingInfos[2].usedTime}}秒</span>
                  <label class="nick-name">{{activityMemberRankingInfos[2].nickName || nickNamePH}}</label>
                </span>
                <div class="ranking-other-wrap">
                  <span class="ranking-other-item"
                    v-for="(item, idx) in activityMemberRankingInfos" :key="idx"
                    v-if="idx > 2">
                    <label class="ranking-number">{{idx + 1}}</label>
                    <img class="photo-thumb" :src="item.headImg || 'test'" :alt="item.nickName || nickNamePH" />
                    <label class="nick-name">{{item.nickName}}</label>
                    <label class="ranking-cont">{{item.num}}题/ {{item.usedTime}}秒</label>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="game-main-bg"></div>
    </div>
    <!-- 提示 -->
    <tip-popup ref="tip-popup" />
    <!-- 活动状态 -->
    <web-socket-activity ref="web-socket-activity" />
    <!-- 弹幕socket -->
    <web-socket-bullet ref="web-socket-bullet" />
  </div>
</template>

<script>
import render from './index.js'
export default render
</script>
<style lang="less">
@import './view.less';
</style>
