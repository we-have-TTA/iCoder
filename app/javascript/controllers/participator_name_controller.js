import { Controller } from "stimulus"
import Rails from "@rails/ujs"

export default class extends Controller {
  static targets = ["username"]

  connect() {
    if (!sessionStorage["username"]) {
      sessionStorage["username"] = this.usernameTarget.value
    }
  }
  changeName() {
    const data = {
      username: this.usernameTarget.value,
      id: this.element.dataset.id,
    }
    Rails.ajax({
      url: "/api/v1/users",
      type: "patch",
      data: new URLSearchParams(data).toString(),
      success: (resp) => {
        console.log(resp)
        sessionStorage["username"] = this.usernameTarget.value
      },
      error: () => {
        this.usernameTarget.value = sessionStorage["username"]
      },
    })
  }
}
