import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="reply"
export default class extends Controller {
  static targets = ["form"]
  connect() {
    // console.log(123)
  }
  display() {
    console.log(this)
    this.formTarget.className = "comment-form"
  }
}
