import { Controller } from "stimulus"
import Rails from "@rails/ujs"

export default class extends Controller {
  static targets = ["certain", "nocertain", "title", "input"]
  changeTitle() {
    sessionStorage["roomTitle"] = this.titleTarget.textContent
    this.element.innerHTML = `<input data-roomtitle-target="input" class="text-black" type="text" maxlength="12">
                              <button data-action="click->roomtitle#no_revise_roomtitle">取消</button>
                              <button data-action="click->roomtitle#revise_roomtitle">確認</button>`
  }
  revise_roomtitle() {
    const input = this.inputTarget.value
    this.element.innerHTML = `<button data-action="click->roomtitle#changeTitle"><img src="https://upload.wikimedia.org/wikipedia/commons/6/64/Edit_icon_%28the_Noun_Project_30184%29.svg"class="h-7 w-7"></button>
    <span data-roomtitle-target="title" data-room_change="input">${input}</span>`
    const id = this.element.dataset.room_id
    const data = { id: id, input: input }
    Rails.ajax({
      url: "/api/v1/rooms/change_roomtitle",
      type: "patch",
      data: new URLSearchParams(data).toString(),
      success: (res) => {
        console.log(res)
      },
      error: () => {},
    })
  }

  no_revise_roomtitle() {
    this.element.innerHTML = `<button data-action="click->roomtitle#changeTitle"><img src="https://upload.wikimedia.org/wikipedia/commons/6/64/Edit_icon_%28the_Noun_Project_30184%29.svg"class="h-7 w-7"></button>
    <span data-roomtitle-target="title">${sessionStorage["roomTitle"]}</span>`
  }
}
