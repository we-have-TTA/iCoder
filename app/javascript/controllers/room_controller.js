import { Controller } from "@hotwired/stimulus"
import Rails from "@rails/ujs"

// Connects to data-controller="room"
export default class extends Controller {

  static targets = ["filterCurrentUserButton"]

  connect() {
  }

  filter() {
    if (this.filterCurrentUserButtonTarget.checked) {
      //只show個人帳號開的room
      const currentUserId = this.element.dataset.currentuserid
      const data = {
        userid: currentUserId,
      }
      Rails.ajax({
        url: `/api/v1/users/rooms`,
        type: "post",
        data: new URLSearchParams(data).toString(),

        success: ({ rooms }) => {
          let html = ""
          var regexp = /[0-9]{4}-[0-9]{2}-[0-9]{2}/g;
          for (var i = 0; i < rooms.length; i++) {
            html += `<tr>
              <td>person-${rooms[i].title}</td>
              <td>${rooms[i].user_id}</td>
              <td>${rooms[i].status}</td>
              <td>${rooms[i].category}</td>
              <td>${rooms[i].language}</td>
              <td>${(rooms[i].created_at).match(regexp)}</td>
              <td><a href="/dashboard/rooms/${rooms[i].id}">view</a></td>
              <td><a data-confirm="Delete Room? Are you sure?" rel="nofollow" data-method="delete" href="/dashboard/rooms/${rooms[i].id}">delete</a></td>
            </tr > `
          }
          const tbody = document.querySelector(".room_table tbody")
          tbody.innerHTML = ""
          tbody.insertAdjacentHTML("afterbegin", html)
        },
        error: (err) => {
          console.log(err)
        },
      })

    } else {
      //show出全部room
    }

  }

}
