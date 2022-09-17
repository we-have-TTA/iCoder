import { Controller } from "stimulus"
import Rails from "@rails/ujs"

export default class extends Controller {
  static targets = ["filterCurrentUserButton", "roomTable","countdown"]

  connect() {
    Rails.ajax({
      url: "/dashboard/rooms/countdown",
      type: "get",
      success: ( {rooms_duration} ) => {
        const deleteButton = this.countdownTargets
        const countdownStandard = (this.element.dataset.countdown_standard*60*60)
        deleteButton.forEach((target)=> {
          rooms_duration.forEach((room) => {
            if (target.dataset.room_uuid == room.uuid) {
              let offsetTime = Number(countdownStandard-room.existTime)
              setInterval(()=> {
                offsetTime -= 1
                let sec = String(parseInt(offsetTime % 60)).padStart(2,'0')
                let min = String(parseInt((offsetTime / 60) % 60)).padStart(2,'0')
                let hr = String(parseInt(offsetTime / 60 / 60)).padStart(2,'0')
                target.textContent = `距可刪除\n${hr}:${min}:${sec}`
              }, 1000);
            }
          })
        })
      },
      error: () => {},
    })
  }

  filter(e) {
    const data = {
      userid: this.element.dataset.currentuserid,
    }
    if (e.target.checked) {
      data["allRoom"] = false
    } else {
      data["allRoom"] = true
    }
    Rails.ajax({
      url: `/api/v1/users/rooms`,
      type: "post",
      data: new URLSearchParams(data).toString(),

      success: ({ rooms }) => {
        let html = ""
        var regexp = /[0-9]{4}-[0-9]{2}-[0-9]{2}/g
        for (var i = 0; i < rooms.length; i++) {
          html += `<tr>
              <td>${rooms[i].title}</td>
              <td>${rooms[i].user_id}</td>
              <td>${rooms[i].status}</td>
              <td>${rooms[i].category}</td>
              <td>${rooms[i].language}</td>
              <td>${rooms[i].created_at.match(regexp)}</td>
              <td><a href="/dashboard/rooms/${rooms[i].id}">view</a></td>
              <td><a data-confirm="Delete Room? Are you sure?" rel="nofollow" data-method="delete" href="/dashboard/rooms/${
                rooms[i].id
              }">delete</a></td>
            </tr > `
        }
        this.roomTableTarget.innerHTML = ""
        this.roomTableTarget.insertAdjacentHTML("afterbegin", html)
      },
      error: (err) => {
        console.log(err)
      },
    })
  }
}
