import { Controller } from "stimulus"
import Rails from "@rails/ujs"

export default class extends Controller {
  createRuntime(e) {
    const language = e.target.textContent
    const iframe = document.getElementById("iframe").contentWindow
    const uuid = this.element.dataset.roomuuid
    iframe.postMessage(`reload`, this.element.dataset.src)
    console.log("清除！")
    // 之後改成引用editor_controller.js 的 displayMenu()
    this.element.className =
      "mt-2.5 py-3 flex justify-evenly w-full bg-gray-800 absolute z-10 rounded-md hidden"

    const payload = {
      uuid: uuid,
      language: language,
    }

    Rails.ajax({
      url: "/dashboard/rooms/createruntime",
      type: "post",
      data: new URLSearchParams(payload).toString(),
      success: ({ container }) => {
        document.getElementById("current_language").textContent = language
        iframe.postMessage(`${container}`, this.element.dataset.src)
        console.log(`iCoder 發送訊息: ${container}`)
      },
      error: (err) => {
        console.log("error" + err)
      },
    })
  }
}
