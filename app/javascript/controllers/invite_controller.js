import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="invite"
export default class extends Controller {
  connect() {
    console.log("123")
  }

  invite_member() {}
}
