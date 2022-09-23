import { Controller } from "stimulus"
import consumer from "../channels/consumer"
import Rails from "@rails/ujs"
import { v4 as uuidv4 } from "uuid"

export default class extends Controller {
  static targets = ["color", "brush", "eraser", "canvas"]

  _cableConnected() {
    console.log("cable DONE")
  }

  _cableDisconnected() {}

  _cableReceived({ sessionID, msg }) {
    if (sessionID === localStorage["sessionID"]) {
      return
    }
    // FIXME 處理同步衝突 自己正在畫畫時 不同步其他人訊息
    // 如果正在畫畫，將別人訊息放入 setTimeout 稍後再執行

    // FIXME 傳遞其他訊息
    console.log(JSON.parse(msg.content))
    JSON.parse(msg.content).forEach((elem) => {
      // loop through instructions
      console.log(this.ctx[elem[0]])
      if (this.ctx[elem[0]].length === 1) {
      } else {
        if (elem[0] === "strokeStyle") {
          this.ctx.strokeStyle = elem[1]
        } else if (elem[0] === "save") {
          this.ctx.save()
        } else if (elem[0] === "restore") {
          this.ctx.restore()
        } else if (elem[0] === "beginPath") {
          this.ctx.beginPath()
        } else {
          console.log(elem)
          this.ctx[elem[0]].apply(this.ctx, elem.slice(1))
        }
      }
    })
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
    this.isPainting = false
    this.eraserEnabled = false
    this.ctx = this.canvasTarget.getContext("2d")
    this.canvasTarget.width = window.innerWidth
    this.canvasTarget.height = window.innerHeight
    this.startX = 0
    this.startY = 0
    this.canvasObject = [["beginPath"]]
    this.toggleBrush()
  }

  toggleCursor(cursorType) {
    this.eraserEnabled = cursorType

    if (cursorType === "eraser") {
      this.eraserTarget.classList.add("active")
      this.brushTarget.classList.remove("active")
      this.ctx.globalCompositeOperation = "destination-out"
      this.canvasTarget.classList.add("eraser_cursor")
      this.canvasTarget.classList.remove("pencil_cursor")
    }
    if (cursorType === "brush") {
      this.eraserTarget.classList.remove("active")
      this.brushTarget.classList.add("active")
      this.ctx.globalCompositeOperation = "source-over"
      this.canvasTarget.classList.remove("eraser_cursor")
      this.canvasTarget.classList.add("pencil_cursor")
    }
  }
  toggleEraser() {
    this.toggleCursor("eraser")
  }
  toggleBrush() {
    this.toggleCursor("brush")
  }
  clean() {
    const width = this.canvasTarget.width
    const height = this.canvasTarget.height

    this.ctx.clearRect(0, 0, width, height)

    this.canvasObject.push(["clearRect", 0, 0, width, height])
    this.canvasObject.push(["restore"])

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
    this.canvasObject = [["save"], ["beginPath"]]
  }

  color({ target }) {
    // 選色
    this.ctx.strokeStyle = target.value

    this.canvasObject.push(["strokeStyle", target.value])
  }

  changeLineWidth({ target }) {
    // 畫筆粗細
    this.ctx.lineWidth = target.value

    this.canvasObject.push(["lineWidth", target.value])
  }

  mousedown() {
    this.isPainting = true
    this.canvasObject = [
      ["save"],
      ["beginPath"],
      ["strokeStyle", this.ctx.strokeStyle],
    ]
  }

  mousemove(e) {
    if (this.isPainting) {
      this.draw(e)
    }
  }

  mouseup() {
    this.isPainting = false
    this.canvasObject.push(["stroke"])
    this.canvasObject.push(["restore"])

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
  }

  draw(e) {
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
