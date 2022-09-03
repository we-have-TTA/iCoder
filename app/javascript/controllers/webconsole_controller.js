import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  // static targets = ["ruby", "javascript"]
  connect() {
    console.log(this.getUserId())
  }

  getUserId = () => {
    return this.element.dataset.user_id
  }

  // createRubyRuntime() {
  //   // 之後callback改寫
  //   const iframe = document.getElementById("iframe").contentWindow
  //   const userid = this.getUserId()
  //   iframe.postMessage(`reload`, this.element.dataset.src)
  //   console.log("清除！")

  //   setTimeout(() => {
  //     iframe.postMessage(`${userid}-ruby`, this.element.dataset.src)
  //     console.log(`iCoder 發送訊息: ${userid}-ruby`)
  //   }, 400)
  // }

  createRubyRuntime() {
    // 之後callback改寫
    const iframe = document.getElementById("iframe").contentWindow
    const userid = this.getUserId()
    iframe.postMessage(`reload`, this.element.dataset.src)
    console.log("清除！")

    setTimeout(() => {
      iframe.postMessage(`test-ruby`, this.element.dataset.src)
      console.log(`iCoder 發送訊息: ${userid}-ruby`)
    }, 400)
  }

  createJavaScriptRuntime() {
    const iframe = document.getElementById("iframe").contentWindow
    const userid = this.getUserId()
    iframe.postMessage(`reload`, this.element.dataset.src)
    console.log("清除！")

    setTimeout(() => {
      iframe.postMessage(`${userid}-javascript`, this.element.dataset.src)
      console.log(`iCoder 發送訊息: ${userid}-javascript`)
    }, 400)
  }
}
