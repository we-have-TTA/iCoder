export default function () {
  const canvas = document.getElementById("drawing-board")
  const toolbar = document.getElementById("toolbar")
  const ctx = canvas.getContext("2d")
  const canvasOffsetX = canvas.offsetLeft
  const canvasOffsetY = canvas.offsetTop
  const brush = document.getElementById("brush")
  const eraser = document.getElementById("eraser")

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  let isPainting = false
  let eraserEnabled = false
  let lineWidth = 5
  let startX
  let startY
  // 觸發橡皮擦
  toolbar.addEventListener("click", (e) => {
    if (e.target.id === "eraser") {
      eraserEnabled = true
      // 透過 active 進行切換橡皮擦跟畫筆，使用橡皮擦->開，畫筆->關
      eraser.classList.add("active")
      brush.classList.remove("active")
      // destination-out ->橡皮擦 覆蓋且去除 原來筆畫 = 新筆跡 去掉舊的
      ctx.globalCompositeOperation = "destination-out"
    }
    // 橡皮擦改用畫筆時，觸發畫筆
    if (e.target.id === "brush") {
      eraserEnabled = false
      eraser.classList.remove("active")
      brush.classList.add("active")
      // source-over -> 蓋掉舊筆跡
      ctx.globalCompositeOperation = "source-over"
    }
  })
  // 觸發清除鈕
  toolbar.addEventListener("click", (e) => {
    if (e.target.id === "clean") {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  })

  toolbar.addEventListener("change", (e) => {
    // 選色
    if (e.target.id === "stroke") {
      ctx.strokeStyle = e.target.value
    }
    // 畫筆粗細
    if (e.target.id === "lineWidth") {
      lineWidth = e.target.value
    }
  })
  // 校正筆觸差距
  const brushstrokes = 70

  // 畫的動作
  const draw = (e) => {
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
