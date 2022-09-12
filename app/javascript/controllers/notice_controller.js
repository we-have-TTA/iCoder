import { Controller } from "stimulus"

export default class extends Controller {
  connect() {
    setTimeout(() => {
      this.dismiss()
    }, 5000)
  }
  dismiss() {
    this.element.remove()
  }
}
