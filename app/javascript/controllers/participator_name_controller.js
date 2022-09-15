import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["username"]

  connect() {
    if (!localStorage["username"]) {
      localStorage["username"] = this.usernameTarget.value
    } else {
      this.usernameTarget.value = localStorage["username"]
    }
  }
  changeName() {
    localStorage["username"] = this.usernameTarget.value
  }
}
