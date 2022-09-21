import { Controller } from "stimulus"
import("../canvas")

export default class extends Controller {
  static targets = ["color", "brush", "eraser", "canvas"]
  connect() {
    this.lineWidth = 5
    this.isPainting = false
    this.eraserEnabled = false
    this.ctx = this.canvasTarget.getContext("2d")
    this.canvasTarget.width = window.innerWidth
    this.canvasTarget.height = window.innerHeight
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
    this.ctx.stroke()
    this.ctx.beginPath()
  }
  draw(e) {
    this.ctx.lineWidth = this.lineWidth
    this.ctx.lineCap = "round"
    this.ctx.lineJoin = "round"

    // 校正筆觸差距 70
    this.ctx.lineTo(e.clientX - 70, e.clientY)
    this.ctx.stroke()
  }
}
