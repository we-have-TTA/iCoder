import { Controller } from "stimulus"

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
  }

  changeName(e) {
    if (e.target.nodeName === "INPUT") {
      localStorage["username"] = this.usernameTarget.value
    } else {
      localStorage["username"] = e.target.firstElementChild.value
      this.usernameTarget.value = localStorage["username"]
      this.modalTarget.remove()
    }
  }

  modal(previousName) {
    const myModal = document.createElement("div")
    myModal.classList.add("my-modal")
    myModal.setAttribute("data-participator-name-target", "modal")
    if (previousName !== "") {
      myModal.insertAdjacentHTML(
        "afterbegin",
        `<div class="box">
          <form action="" data-action="participator-name#changeName:prevent">
            <input id="participatorName" class="text-black" type="text" placeholder="你的名字" required="true" value=${previousName}>
            <input type="submit">
          </form>
        </div>`
      )
    } else {
      myModal.insertAdjacentHTML(
        "afterbegin",
        `<div class="box">
          <form action="" data-action="participator-name#changeName:prevent">
            <input id="participatorName" class="text-black" type="text" placeholder="你的名字" required="true">
            <input type="submit">
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
