<!--
 * websocketDom Vue
 * @authors AndyPan (pye-mail@163.com)
 * @date    2019年10月31日11:26:50
-->

<template>
  <div class="websocket" ref="j-websocket">
    <div class="error-msg" v-if="errorMsg">
      <div class="msg">{{errorMsg}}</div>
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
