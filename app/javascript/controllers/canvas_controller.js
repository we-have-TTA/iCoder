import { Controller } from "stimulus"
import consumer from "../channels/consumer"
import Rails from "@rails/ujs"

export default class extends Controller {
  static targets = ["color", "brush", "eraser", "canvas"]

  _cableConnected() {
    console.log("cable DONE")
    // Called when the subscription is ready for use on the server
    // can add welcome msg like 'user_xx is join the room!'
  }

  _cableDisconnected() {
    // Called when the subscription has been terminated by the server
    // can add leave msg otherwise
  }

  _cableReceived({ sessionID, msg }) {
    // Called when there's incoming data on the websocket for this channel
    if (sessionID === localStorage["sessionID"]) {
      return
    }
    // FIXME 處理同步衝突 自己正在畫畫時 不同步其他人訊息
    // FIXME 傳遞其他訊息
    this.ctx.save()
    this.ctx.beginPath()

    JSON.parse(msg.content).forEach((elem) => {
      // loop through instructions
      this.ctx[elem[0]].apply(this.ctx, elem.slice(1))
    })

    this.ctx.restore()
  }
  // https://developer.mozilla.org/en-US/docs/Web/API/Location/pathname
  // document.location.pathname ＝ /en-US/docs/Web/API/Location/pathname
  getRoomUUID() {
    return document.location.pathname.replace("/canvas/", "")
  }
  getSessionID() {
    return (localStorage["sessionID"] ||= uuidv4())
  }

  connect() {
    import("../canvas")
    this.channel = consumer.subscriptions.create(
      {
        channel: "CanvasChannel",
        uuid: this.getRoomUUID(),
        sessionID: this.getSessionID(),
      },
      {
        connected: this._cableConnected.bind(this),
        disconnected: this._cableDisconnected.bind(this),
        received: this._cableReceived.bind(this),
      }
    )
    this.lineWidth = 5
    this.isPainting = false
    this.eraserEnabled = false
    this.ctx = this.canvasTarget.getContext("2d")
    this.canvasTarget.width = window.innerWidth
    this.canvasTarget.height = window.innerHeight
    this.startX = 0
    this.startY = 0
    this.canvasObject = [["beginPath"]]
  }

  toggleCursor(cursorType) {
    this.eraserEnabled = cursorType

    if (cursorType === "eraser") {
      this.eraserTarget.classList.add("active")
      this.brushTarget.classList.remove("active")
      this.ctx.globalCompositeOperation = "destination-out"
    }
    if (cursorType === "brush") {
      this.eraserTarget.classList.remove("active")
      this.brushTarget.classList.add("active")
      this.ctx.globalCompositeOperation = "source-over"
    }
  }
  toggleEraser() {
    this.toggleCursor("eraser")
  }
  toggleBrush() {
    this.toggleCursor("brush")
  }
  clean() {
    this.ctx.clearRect(0, 0, this.canvasTarget.width, this.canvasTarget.height)
  }
  color(e) {
    // 選色
    this.ctx.strokeStyle = e.target.value
  }
  changeLineWidth(e) {
    // 畫筆粗細
    this.lineWidth = e.target.value
  }

  mousedown() {
    this.isPainting = true
  }
  mousemove(e) {
    if (this.isPainting) {
      this.draw(e)
    }
  }
  mouseup() {
    this.isPainting = false
    this.canvasObject.push(["stroke"])

    const data = {
      content: JSON.stringify(this.canvasObject),
      uuid: this.getRoomUUID(),
      sessionID: this.getSessionID(),
    }

    Rails.ajax({
      url: `/api/v1/canvas/${data.uuid}/`,
      type: "post",
      data: new URLSearchParams(data).toString(),
      success: () => {},
      error: () => {},
    })
    this.ctx.beginPath()
    this.canvasObject = [["beginPath"]]
  }

  draw(e) {
    this.ctx.lineWidth = this.lineWidth
    this.ctx.lineCap = "round"
    this.ctx.lineJoin = "round"

    // 校正筆觸差距 70
    const x = e.clientX - 70
    const y = e.clientY

    this.ctx.lineTo(x, y)
    this.ctx.stroke()

    this.canvasObject.push(["lineTo", x, y])
  }
}
