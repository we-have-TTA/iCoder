import { Controller } from "stimulus"
import Rails from "@rails/ujs"

export default class extends Controller {
  createRuntime(e) {
    const language = e.target.textContent
    const uuid = this.element.dataset.roomuuid
    this.element.classList.add("hidden")
    const payload = {
      uuid: uuid,
      language: language,
    }
    Rails.ajax({
      url: "/dashboard/rooms/createruntime",
      type: "post",
      data: new URLSearchParams(payload).toString(),
      success: () => {
      },
      error: (err) => {
        console.log("error" + err)
      },
    })
  }
}
