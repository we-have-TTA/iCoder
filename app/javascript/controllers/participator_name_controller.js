import { Controller } from "stimulus"
import Rails from "@rails/ujs"

export default class extends Controller {
  static targets = ["modal", "username"]

  connect() {
    if (!localStorage["username"]) {
      localStorage["username"] = this.usernameTarget.value
    } else {
      this.usernameTarget.value = localStorage["username"]
    }
    this.modal(localStorage["username"])
    document.querySelector("#participatorName").focus()
    this.broadcastName(localStorage["username"])
  }

  broadcastName(previousName, newName = null) {
    let data = {
      "message[username]": "system",
      "message[content]": `${previousName} changes name to ${localStorage["username"]}`,
      uuid: document.location.pathname.replace("/", ""),
    }

    if (newName) {
      if (newName === previousName) {
        return
      }
      data = {
        "message[username]": "system",
        "message[content]": `${previousName} changes name to ${localStorage["username"]}`,
        uuid: document.location.pathname.replace("/", ""),
      }
    } else {
      data = {
        "message[username]": "system",
        "message[content]": `${previousName} join the room`,
        uuid: document.location.pathname.replace("/", ""),
      }
    }

    Rails.ajax({
      url: "/messages",
      type: "post",
      data: new URLSearchParams(data).toString(),
      success: () => {},
      error: () => {},
    })
  }

  changeName(e) {
    const previousName = localStorage["username"]
    if (e.target.nodeName === "INPUT") {
      localStorage["username"] = this.usernameTarget.value
    } else {
      localStorage["username"] = e.target.firstElementChild.value
      this.usernameTarget.value = localStorage["username"]
      this.modalTarget.remove()
    }
    this.broadcastName(previousName, localStorage["username"])
  }

  modal(previousName) {
    const myModal = document.createElement("div")
    myModal.classList.add("my-modal")
    myModal.setAttribute("data-participator-name-target", "modal")
    if (previousName !== "") {
      myModal.insertAdjacentHTML(
        "afterbegin",
        `<div class="box p-4 rounded-md items-center">
          <div>輸入名字：</div>
          <form action="" data-action="participator-name#changeName:prevent">
            <input id="participatorName" class="text-black px-2" type="text" placeholder="你的名字" required="true" value=${previousName}>
            <input type="submit" class=" bg-gray-400 rounded-lg px-2 ml-2  cursor-pointer ">
          </form>
        </div>`
      )
    } else {
      myModal.insertAdjacentHTML(
        "afterbegin",
        `<div class="box p-4 rounded-md items-center">
          <form action="" data-action="participator-name#changeName:prevent">
            <input id="participatorName" class="text-black px-2" type="text" placeholder="你的名字" required="true">
            <input type="submit" class="bg-gray-400 rounded-lg px-2 ml-2 cursor-pointer ">
          </form>
        </div>`
      )
    }

    this.element.append(myModal)
  }
  stop() {
    document.querySelector("#message_content").focus()
  }
}
