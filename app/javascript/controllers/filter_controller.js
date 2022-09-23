import { Controller } from "stimulus"
import Rails from "@rails/ujs"

export default class extends Controller {
  static targets = ["filter"]

  checkout() {
    this.filterTarget.submit()
  }
}
