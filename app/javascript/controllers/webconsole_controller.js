import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    console.log(this.element.dataset.roomUUID)
  }

  createRubyRuntime() {
    // FIXME 之後callback改寫
    const iframe = document.getElementById("iframe").contentWindow
    const roomUUID = this.element.dataset.roomUUID
    iframe.postMessage(`reload`, this.element.dataset.src)
    console.log("清除！")

    setTimeout(() => {
      iframe.postMessage(`${roomUUID}-ruby`, this.element.dataset.src)
      console.log(`iCoder 發送訊息: ${roomUUID}-ruby`)
    }, 400)
  }

  createJavaScriptRuntime() {
    const iframe = document.getElementById("iframe").contentWindow
    const roomUUID = this.element.dataset.roomUUID
    iframe.postMessage(`reload`, this.element.dataset.src)
    console.log("清除！")

    setTimeout(() => {
      iframe.postMessage(`${roomUUID}-javascript`, this.element.dataset.src)
      console.log(`iCoder 發送訊息: ${roomUUID}-javascript`)
    }, 400)
  }
}
