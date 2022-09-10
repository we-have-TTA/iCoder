export default function () {
  const canvas = document.getElementById("drawing-board")
  const toolbar = document.getElementById("toolbar")
  const ctx = canvas.getContext("2d")
  const canvasOffsetX = canvas.offsetLeft
  const canvasOffsetY = canvas.offsetTop
  const brush = document.getElementById("brush")

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  let isPainting = false
  let lineWidth = 5
  let startX
  let startY

  const eraser = document.getElementById("eraser")
  let eraserEnabled = false

  toolbar.addEventListener("click", (e) => {
    if (e.target.id === "eraser") {
      eraserEnabled = true
      eraser.classList.add("active")
      brush.classList.remove("active")
      ctx.globalCompositeOperation = "destination-out"
    }
    if (e.target.id === "brush") {
      eraserEnabled = false
      eraser.classList.remove("active")
      brush.classList.add("active")
      ctx.globalCompositeOperation = "source-over"
    }
  })

  toolbar.addEventListener("click", (e) => {
    if (e.target.id === "clean") {
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
  const brushstrokes = 51
  const draw = (e) => {
    // 畫的動作
    if (!isPainting) {
      return
    }

    ctx.lineWidth = lineWidth
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    ctx.lineTo(e.clientX - brushstrokes, e.clientY)
    ctx.stroke()
  }

  canvas.addEventListener("mousedown", (e) => {
    isPainting = true
    startX = e.clientX
    startY = e.clientY
  })

  canvas.addEventListener("mouseup", (e) => {
    isPainting = false
    ctx.stroke()
    ctx.beginPath()
  })
  canvas.addEventListener("mousemove", draw)

  // // 滑鼠按下事件
  // canvas.onmousedown = function (e) {
  //   eraserEnabled = true
  //   if (eraserEnabled) {
  //     //要使用eraser
  //     context.clearRect(x - 5, y - 5, 10, 10)
  //   } else {
  //     lastPoint = { x: x, y: y }
  //   }
  // }

  // 滑鼠移動事件
  // canvas.onmousemove = function (e) {
  //   let x = e.clientX
  //   let y = e.clientY
  //   if (!painting) {
  //     return
  //   }
  //   if (eraserEnabled) {
  //     context.clearRect(x - 5, y - 5, 10, 10)
  //   } else {
  //     var newPoint = { x: x, y: y }
  //     drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
  //     lastPoint = newPoint
  //   }
  // }

  // 滑鼠鬆開事件

  // let undo = document.getElementById("undo")
  // let redo = document.getElementById("redo")
  // canvas.onmouseup = function () {
  //   eraserEnabled = false
  // }

  // let canvasHistory = []
  // let step = -1
  // // 繪製方法
  // function canvasDraw() {
  //   step++
  //   if (step < canvasHistory.length) {
  //     canvasHistory.length = step // 截斷數組
  //   }
  //   // 添加新的繪製到歷史記錄
  //   canvasHistory.push(canvas.toDataURL())
  // }

  // 撤銷方法
  // function canvasUndo() {
  //   if (step > 0) {
  //     step--
  //     // ctx.clearRect(0,0,canvas.width,canvas.height);
  //     let canvasPic = new Image()
  //     canvasPic.src = canvasHistory[step]
  //     canvasPic.onload = function () {
  //       ctx.drawImage(canvasPic, 0, 0)
  //     }
  //     undo.classList.add("active")
  //   } else {
  //     undo.classList.remove("active")
  //     alert("不能再繼續撤銷了")
  //   }
  // }
  // // 重做方法
  // function canvasRedo() {
  //   if (step < canvasHistory.length - 1) {
  //     step++
  //     let canvasPic = new Image()
  //     canvasPic.src = canvasHistory[step]
  //     canvasPic.onload = function () {
  //       // ctx.clearRect(0,0,canvas.width,canvas.height);
  //       ctx.drawImage(canvasPic, 0, 0)
  //     }
  //     redo.classList.add("active")
  //   } else {
  //     redo.classList.remove("active")
  //     alert("已經是最新的記錄了")
  //   }
  // }
  // undo.onclick = function () {
  //   canvasUndo()
  // }
  // redo.onclick = function () {
  //   canvasRedo()
  // }
  // eraser.onclick = function () {
  //   clean = true
  //   this.classList.add("active")
  //   brush.classList.remove("active")
  // }

  // brush.onclick = function () {
  //   clear = false
  //   this.classList.add("active")
  //   eraser.classList.remove("active")
  // }
  // let historyDeta = []

  // function saveData(data) {
  //   historyDeta.length === 10 && historyDeta.shift() // 上限为储存10步，太多了怕挂掉
  //   historyDeta.push(data)
  // }

  // undo.onclick = function () {
  //   if (historyDeta.length < 1) return false
  //   ctx.putImageData(historyDeta[historyDeta.length - 1], 0, 0)
  //   historyDeta.pop()
  // }
}
