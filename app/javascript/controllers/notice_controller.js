import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="notice"
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
