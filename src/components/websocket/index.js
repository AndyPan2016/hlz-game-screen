/**
 * socket组件 JavaScript
 * @authors AndyPan (pye-mail@163.com)
 * @date    2019年10月31日11:24:14
 */

export default {
  data () {
    return {
      // websocket DOM元素
      websocketDom: null,
      // WebSocket实例
      webSocketInstance: null,
      // 错误消息
      errorMsg: null
    }
  },
  props: {
    // WebSocket URI
    wsURI: { type: String },
    // webSocketOpen
    onWebSocketOpen: { type: Function },
    // webSocketMessage
    onWebSocketMessage: { type: Function },
    // webSocketError
    onWebSocketError: { type: Function },
    // webSocketClose
    onWebSocketClose: { type: Function }
  },
  components: {},
  methods: {
    /**
     * 初始化WebSocket
     */
    initWebSocket (wsURI) {
      wsURI = wsURI || this.wsURI
      if (WebSocket) {
        if (wsURI) {
          let webSocketInstance = new WebSocket(wsURI)
          // WebSocket打开连接
          webSocketInstance.onopen = this.webSocketOpen
          // WebSocket接收消息
          webSocketInstance.onmessage = this.webSocketMessage
          // WebSocket错误
          webSocketInstance.onerror = this.webSocketError
          // WebSocket关闭
          webSocketInstance.onclose = this.webSocketClose
          this.webSocketInstance = webSocketInstance
          return webSocketInstance
        } else {
          this.errorMsg = 'WebSocket连接不存在'
        }
      } else {
        this.errorMsg = '浏览器不支持WebSocket，请更换浏览器'
      }
    },
    /**
     * WebSocket打开连接
     */
    webSocketOpen (e) {
      this.errorMsg = null
      let onWebSocketOpen = this.onWebSocketOpen
      if (onWebSocketOpen) {
        onWebSocketOpen(e)
      }
    },
    /**
     * WebSocket接收消息
     */
    webSocketMessage (e) {
      let onWebSocketMessage = this.onWebSocketMessage
      if (onWebSocketMessage) {
        onWebSocketMessage(e)
      }
    },
    /**
     * WebSocket错误
     */
    webSocketError (e) {
      let result
      let onWebSocketError = this.onWebSocketError
      if (onWebSocketError) {
        result = onWebSocketError(e)
      }
      if (result !== false) {
        this.errorMsg = '连接失败，正在重新连接...'
        this.initWebSocket()
      }
    },
    /**
     * WebSocket关闭
     */
    webSocketClose (e) {
      let onWebSocketClose = this.onWebSocketClose
      if (onWebSocketClose) {
        onWebSocketClose(e)
      }
    }
  },
  created () {},
  mounted () {
    this.websocketDom = this.$refs['j-websocket']
    if (this.wsURI) {
      this.initWebSocket()
    }
  }
}
