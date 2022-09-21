import { Controller } from "stimulus"
import consumer from "../channels/consumer"

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

  _cableReceived({ content, created_at, username }) {
    // Called when there's incoming data on the websocket for this channel
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
    // console.log(this.ctx)
    // this.ctx.stroke()
    this.ctx.stroke()
    let url = this.getDrawingAsString()
    // console.log(url)
    this.clean()
    this.reuseCanvasString(url)
    // this.ctx.beginPath()
    // setTimeout(() => {
    //   this.ctx.restore()
    //   this.ctx.stroke()
    //   this.ctx.beginPath()
    // }, 500)
  }
  draw(e) {
    this.ctx.lineWidth = this.lineWidth
    this.ctx.lineCap = "round"
    this.ctx.lineJoin = "round"

    // 校正筆觸差距 70
    this.ctx.lineTo(e.clientX - 70, e.clientY)
    // this.ctx.stroke()
  }
  getDrawingAsString() {
    return this.canvasTarget.toDataURL()
  }

  reuseCanvasString(url) {
    let img = new Image()
    img.onload = () => {
      // Note: here img.naturalHeight & img.naturalWidth will be your original canvas size
      this.ctx.drawImage(img, 0, 0)
    }
    img.src = url
  }
}
