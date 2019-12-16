<!--
 * 弹幕视图 Vue
 * @authors AndyPan (pye-mail@163.com)
 * @date    2019年10月29日17:45:04
-->

<template>
  <div class="ui-barrage" ref="j-ui-barrage">
    <!-- <div class="barrage-row" v-for="(dataItem, idx) in barrageIn"
      :class="dataItem.rowClass + ' ' + dataItem.transition"
      :key="idx"
      :ref="dataItem.refs"
      :style="dataItem.styleText ? dataItem.styleText : 'opacity: 0;'">
      <span class="barrage-item">
        <span class="photo-thumb"><img src="" class="photo-img" /></span>
        <label class="brrage-text">{{dataItem.text}}</label>
      </span>
    </div> -->
  </div>
</template>

<script>
import render from './index.js'
export default render
</script>
<style lang="less">
@import './view.less';
</style>
