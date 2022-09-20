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
