import { Controller } from "stimulus"
import Rails from "@rails/ujs"

export default class extends Controller {
  static targets = ["countdown"]

  connect() {
    Rails.ajax({
      url: "/dashboard/rooms/countdown",
      type: "get",
      success: ({ rooms_duration }) => {
        const deleteButton = this.countdownTargets
        const countdownStandard =
          this.element.dataset.countdown_standard * 60 * 60
        deleteButton.forEach((target) => {
          rooms_duration.forEach((room) => {
            if (target.dataset.room_uuid == room.uuid) {
              let offsetTime = Number(countdownStandard - room.existTime)
              setInterval(() => {
                offsetTime -= 1
                let sec = String(parseInt(offsetTime % 60)).padStart(2, "0")
                let min = String(parseInt((offsetTime / 60) % 60)).padStart(
                  2,
                  "0"
                )
                let hr = String(parseInt(offsetTime / 60 / 60)).padStart(2, "0")
                target.textContent = `距可刪除\n${hr}:${min}:${sec}`
              }, 1000)
            }
          })
        })
      },
      error: () => {},
    })
  }
}
