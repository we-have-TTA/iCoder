const canvas = document.getElementById("drawing-board")
const toolbar = document.getElementById("toolbar")
const ctx = canvas.getContext("2d")

const canvasOffsetX = canvas.offsetLeft
const canvasOffsetY = canvas.offsetTop
// 是一個只讀屬性，返回當前元素左上角相對於 HTMLElement.offsetParent 節點的左邊界偏移的像素值。
canvas.width = window.innerWidth - canvasOffsetX
canvas.height = window.innerHeight - canvasOffsetY

let isPainting = false
let lineWidth = 5
let startX
let startY

toolbar.addEventListener("click", (e) => {
  if (e.target.id === "clear") {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }
})
toolbar.addEventListener("change", (e) => {
  if (e.target.id === "stroke") {
    ctx.strokeStyle = e.target.value
  }
  if (e.target.id === "lineWidth") {
    lineWidth = e.target.value
  }
})
const draw = (e) => {
  if (!isPainting) {
    return
  }
  ctx.lineWidth = lineWidth
  ctx.lineCap = "round"

  ctx.lineTo(e.clientX - canvasOffsetX, e.clientY)
  // ctx.stroke()
}
canvas.addEventListener("mousedown", (e) => {
  isPainting = true
  startX = e.clientX
  startY = e.clientY
  // console.log(e.target)
  // console.log(isPainting)
})
canvas.addEventListener("mouseup", (e) => {
  isPainting = false
  ctx.stroke()
  ctx.beginPath()
})
canvas.addEventListener("mousemove", draw)
