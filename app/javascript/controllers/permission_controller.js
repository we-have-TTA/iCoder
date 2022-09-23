import { Controller } from "stimulus"
import Rails from "@rails/ujs"

export default class extends Controller {
  static targets = ["control_button", "donate_alert", "alert_display"]

  connect() {
    Rails.ajax({
      url: "/dashboard/rooms/team_plan",
      type: "get",
      success: ({ permission, rooms_count }) => {
        if (!permission && rooms_count >= 2) {
          this.control_buttonTarget.disabled = true
          this.control_buttonTarget.setAttribute(
            "data-create-permission",
            "disable"
          )
        }
      },
      error: () => {},
    })
  }

  checkPermission(e) {
    if (
      this.control_buttonTarget.attributes["data-create-permission"].value ===
      "disable"
    ) {
      const coverHtml = `<div data-permission-target="donate_alert"
                              data-action="click->permission#close"
                              class="black-cover-bg z-30 hidden">
                           <div data-permission-target="alert_display"
                           class="paybox h-1/3 p-20 absolute top-0 bottom-0 left-0 right-0 m-auto text-center bg-white">
                              <div class=" p-20 absolute top-0 bottom-0 left-0 right-0 m-auto text-center rounded-lg bg-gray-100 box-shadow shiny whitespace-pre-wrap text-3xl">想要無限制的交流會議嗎？\n動動手指贊助吧！
                                <a class=" block mt-3 py-3 px-7 w-full text-green-50 font-medium text-center bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-lg box-shadow text-3xl" href="/plans">立即點擊</a>
                              </div>
                           </div>
                         </div>`
      this.element.insertAdjacentHTML("beforeend", coverHtml)
      this.donate_alertTarget.classList.remove("hidden")
      setTimeout(() => {
        this.alert_displayTarget.classList.add("translate-y-36")
        this.alert_displayTarget.classList.remove("opacity-0")
      }, 100)
    } else {
      setTimeout(() => {
        location.reload()
      }, 100)
    }
  }

  close(e) {
    if (e.target.dataset.action === "click->permission#close") {
      this.alert_displayTarget.classList.remove("translate-y-36")
      this.alert_displayTarget.classList.add("opacity-0")
      setTimeout(() => {
        this.donate_alertTarget.classList.add("hidden")
        this.donate_alertTarget.remove()
      }, 500)
    }
  }
}
