<!--
 * 页面视图 Vue
 * @authors AndyPan (pye-mail@163.com)
 * @date    2018-08-14 10:10:02
-->

<template>
  <div class="ui-popup"
    :class="(thisDevice ? thisDevice + ' ' : '') + (customClass ? customClass + ' ' : '') + (isVisible ? 'show' : '') + (popupType ? ' ' + popupType : '')">
    <div class="ui-popup-mask"
      :class="isShow ? 'active' : ''"
      @click="maskClickEvent">
    </div>
    <div class="ui-popup-main" :class="(isShow ? 'active' : '') + (model ? ' ' + model : '') + (full ? ' popup-main-full' : '') + (' ' + popupToTop)">
      <!-- 弹出框头部 -->
      <div class="ui-popup-hd" v-if="title !== 'visible' && popupType !== 'loading' && popupType !== 'tip'">
        <span class="popup-hd-title" v-if="type !== 'picker'">
          <slot name="popup-title"></slot>
          <!-- 如果title为false，就不显示默认弹出框title -->
          {{title === false ? '' : popupTitle}}
        </span>
        <span class="popup-hd-tools" v-if="type !== 'picker'">
          <a href="javascript:;" class="tools-close" @click="toolsCloseEvent">X</a>
        </span>
        <div class="popup-hd-picker" v-if="type === 'picker'" @click="ftClickEvent">
          <a href="javascript:;"
            class="popup-btn j-popup-btn"
            v-for="(button, key) in customButtons"
            v-bind:key="key"
            :data-type="key"
            :data-value="button.value"
            v-if="button.isVisible != false"
            :class="key">{{button.text}}</a>
          <span class="picker-hd-title">{{title === false ? '' : popupTitle}}</span>
        </div>
      </div>
      <!-- 弹出框内容 -->
      <div class="ui-popup-bd" v-if="popupDownUpData" @click="bdClickEvent">
        <a href="javascript:;"
          v-for="(item, idx) in popupDownUpData"
          v-bind:key="idx"
          class="downup-data-item j-downup-item"
          :class="(item.type ? (' type-' + item.type) : '') + (item.textAlign ? (' text-align-' + item.textAlign) : '')"
          :data-value="item.value">{{item.text}}</a>
      </div>
      <div class="ui-popup-bd picker-bd" v-else-if="type === 'picker'">
        <slot name="popup-content-picker"></slot>
        <div class="second-title-picker" v-if="secondTitle || popupSecondTitle">
          <div class="picker-title" v-if="secondTitle.title || popupSecondTitle.title">{{secondTitle.title || popupSecondTitle.title}}</div>
          <div class="picker-remark" v-if="secondTitle.remark || popupSecondTitle.remark">{{secondTitle.remark || popupSecondTitle.remark}}</div>
        </div>
        <div class="picker-wrap" :data-ref="pickerRef">
          <van-datetime-picker
            v-if="pickerType"
            v-model="pickerDateModel"
            :type="pickerType"
            :show-toolbar="true"
            :ref="pickerRef"
            :min-date="pickerMinDate"
            :formatter="pickerFormatter"
            @change="pickerChange" />
          <van-picker
            v-else
            :columns="picker || mockCityData"
            :show-toolbar="true"
            :ref="pickerRef"
            @change="pickerChange" />
        </div>
      </div>
      <div :class="'ui-popup-bd' + (spaceMin ? ' space-min' : '')" v-else>
        <slot name="popup-content"></slot>
        <div :class="'second-title-picker ' + popupType" v-if="popupSecondTitle">
          <div class="picker-title" v-if="popupSecondTitle.title">{{popupSecondTitle.title}}</div>
          <div class="picker-remark" v-if="popupSecondTitle.remark">{{popupSecondTitle.remark}}</div>
          <input type="text" ref="j-popup-prompt" :class="'popup-prompt-model ' + promptType" v-if="popupType === 'prompt'" v-model="popupPromptModel" :placeholder="popupPromptPlaceHolder" />
        </div>
        <!-- 如果content为false，就不显示默认弹出框content -->
        {{content === false ? '' : popupContent}}
      </div>
      <!-- 弹出框底部 -->
      <!-- 按钮对象不可用，只能用插槽定义按钮 -->
      <div class="ui-popup-ft" v-if="buttons == 'visible' && popupType !== 'loading' && popupType !== 'tip' && popupType !== 'downup'" @click="ftClickEvent">
        <span class="popup-ft-wrap">
          <slot name="popup-btn"></slot>
        </span>
      </div>
      <!-- 按钮对象可用，并且不为false -->
      <div class="ui-popup-ft" v-else-if="buttons !== false && popupType !== 'loading' && popupType !== 'tip' && (popupType !== 'downup' || downupButton)" @click="ftClickEvent">
        <span class="popup-ft-wrap" v-if="model === 'simple'">
          <span
              v-for="(button, key) in customButtons"
              v-bind:key="key">
            <label :class="'popup-btn ' + button.type" v-if="button.type === 'remark'">{{button.text}}</label>
            <a href="javascript:;"
              class="popup-btn disabled"
              :data-type="key"
              :data-value="button.value"
              v-else-if="button.disabled == true"
              :class="key">{{button.text}}</a>
            <a href="javascript:;"
              class="popup-btn j-popup-btn"
              :data-type="key"
              :data-value="button.value"
              v-else-if="button.isVisible != false"
              :class="key">{{button.text}}</a>
          </span>
        </span>
        <span class="popup-ft-wrap" v-else>
          <a href="javascript:;"
            class="popup-btn j-popup-btn"
            v-for="(button, key) in customButtons"
            v-bind:key="key"
            :data-type="key"
            :data-value="button.value"
            v-if="button.isVisible != false"
            :class="key">{{button.text}}</a>
        </span>
        <slot name="popup-ft-downup"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import {render} from './index.js'
export default render
</script>
<style lang="less">
@import './view.less';
</style>
