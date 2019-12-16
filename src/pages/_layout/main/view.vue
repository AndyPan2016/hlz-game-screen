<!--
 * 页面视图 Vue
 * @authors AndyPan (pye-mail@163.com)
 * @date    2019年10月28日16:20:55
-->

<template>
    <div class="page-main page-main-layout" :class="$store.state.ActivityInfoStore.projectionGameType">
        <div class="page-main-body" :class="rationClass"
            :style="computeAttr.styleText"
            @click="bodyClickEvent">
            <!-- 自定义动态组件渲染使用 -->
            <component v-bind:is="currentComponent"></component>
            <!-- 路由嵌套使用 -->
            <router-view></router-view>
        </div>
        <!-- 数钱游戏的星星 -->
        <i v-if="$store.state.StarStore.isRenderStar"
            v-for="(item, key) in 350"
            :class="starClass(key)"
            :style="starStyle()"
            :key="key"></i>
        <!-- 提示 -->
        <tip-popup ref="tip-popup" />
        <!-- 活动参与 -->
        <web-socket-join ref="web-socket-join" />
        <!-- 排行socket -->
        <web-socket-rank ref="web-socket-rank" />
        <!-- 活动参与 -->
        <web-socket-game ref="web-socket-game" />
        <!-- 活动参与 -->
        <web-socket-activity ref="web-socket-activity" />
    </div>
</template>

<script>
import render from './index.js'
export default render
</script>
<style lang="less">
@import './view.less';
</style>
