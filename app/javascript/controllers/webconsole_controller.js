import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    console.log(this.element.dataset.roomUUID)
  }

  createRuntime(e) {
    const language = e.target.textContent
    const iframe = document.getElementById("iframe").contentWindow
    const roomUUID = this.element.dataset.roomUUID
    iframe.postMessage(`reload`, this.element.dataset.src)
    console.log("清除！")

    // FIXME 之後callback改寫
    setTimeout(() => {
      iframe.postMessage(`${roomUUID}-${language}`, this.element.dataset.src)
      console.log(`iCoder 發送訊息: ${roomUUID}-${language}`)
    }, 400)
  }
}
