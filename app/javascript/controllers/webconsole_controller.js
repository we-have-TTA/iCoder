import { Controller } from "@hotwired/stimulus"
import Rails from "@rails/ujs"

export default class extends Controller {
  connect() {
    console.log(this.element.dataset.roomuuid)
  }

  createRuntime(e) {
    const language = e.target.textContent
    const iframe = document.getElementById("iframe").contentWindow
    const uuid = this.element.dataset.roomuuid
    iframe.postMessage(`reload`, this.element.dataset.src)
    console.log("清除！")

    const payload = {
      uuid: uuid,
      language: language,
    }

    Rails.ajax({
      url: "/dashboard/rooms/createruntime",
      type: "post",
      data: new URLSearchParams(payload).toString(),
      success: ({ container }) => {
        iframe.postMessage(`${container}`, this.element.dataset.src)
        console.log(`iCoder 發送訊息: ${container}`)
      },
      error: (err) => {
        console.log("error" + err)
      },
    })

    // FIXME 之後callback改寫
    // setTimeout(() => {
    //   iframe.postMessage(`${roomUUID}-${language}`, this.element.dataset.src)
    //   console.log(`iCoder 發送訊息: ${roomUUID}-${language}`)
    // }, 400)
  }
}
