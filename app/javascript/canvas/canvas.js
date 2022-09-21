export default function () {
  const canvas = document.getElementById("drawing-board")
  const toolbar = document.getElementById("toolbar")
  const ctx = canvas.getContext("2d")
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

  // 透過 active 進行切換橡皮擦跟畫筆，使用橡皮擦->開，畫筆->關
  // destination-out ->橡皮擦 覆蓋且去除 原來筆畫 = 新筆跡 去掉舊的
  // source-over -> 蓋掉舊筆跡
  function toggleEraser(on) {
    eraserEnabled = on

    if (on) {
      eraser.classList.add("active")
      brush.classList.remove("active")
      ctx.globalCompositeOperation = "destination-out"
    } else {
      eraser.classList.remove("active")
      brush.classList.add("active")
      ctx.globalCompositeOperation = "source-over"
    }
  }

  toolbar.addEventListener("click", ({ target }) => {
    if (target.id === "clean") {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      return
    }

    if (target.id === "eraser") {
      toggleEraser(true)
    } else {
      toggleEraser(false)
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

  // 畫
  const draw = (e) => {
    ctx.lineWidth = lineWidth
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    // 校正筆觸差距 70
    ctx.lineTo(e.clientX - 70, e.clientY)
    ctx.stroke()
  }

  canvas.addEventListener("mousedown", (_) => {
    isPainting = true
  })

  // _ => I don't care
  canvas.addEventListener("mouseup", (_) => {
    isPainting = false
    ctx.stroke()
    ctx.beginPath()
  })

  canvas.addEventListener("mousemove", (e) => {
    if (isPainting) {
      draw(e)
    }
  })
}
