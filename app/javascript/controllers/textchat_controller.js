import { Controller } from "stimulus"

export default class extends Controller {
  readName() {
    const field = document.createElement("input")
    field.setAttribute("type", "hidden")
    field.setAttribute("name", "message[username]")
    const name = localStorage["username"]
    if (name) {
      field.setAttribute("value", name)
    } else {
      return
    }
    this.element.appendChild(field)
    this.element.submit()
  }
}
