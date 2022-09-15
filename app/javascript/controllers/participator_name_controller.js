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
    console.log(previousName)
    const myModal = document.createElement("div")
    myModal.classList.add("my-modal")
    myModal.setAttribute("data-participator-name-target", "modal")
    if (previousName !== "") {
      myModal.insertAdjacentHTML(
        "afterbegin",
        `<div class="box">
          <form action="" data-action="participator-name#changeName:prevent">
            <input class="text-black" type="text" placeholder="你的名字" required="true">
            <p class="text-black">${previousName}</p> <button class="btnstyle_dashboard" data-action="participator-name#usePreviousName">使用之前名字</button>
          </form>
        </div>`
      )
    } else {
      myModal.insertAdjacentHTML(
        "afterbegin",
        `<div class="box">
          <form action="" data-action="participator-name#changeName:prevent">
            <input class="text-black" type="text" placeholder="你的名字" required="true">
          </form>
        </div>`
      )
    }

    this.element.append(myModal)
  }
  usePreviousName() {
    this.modalTarget.remove()
  }
}
