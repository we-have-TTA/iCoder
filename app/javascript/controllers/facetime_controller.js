import { Controller } from "stimulus"
import consumer from "../channels/consumer"

export default class extends Controller {
  static targets =["camera"]
  connect() {
    console.log(123)
    setTimeout(() => {
      console.log(this.element.children)
    }, 1000);
  }

  displayCamera(){
    if (this.cameraTarget.classList.contains("hidden")) {
      if (this.cameraTarget.dataset.connected == "false"){
        this.cameraTarget.children[0].children[0].children[0].children[1].children[0].click()
        this.cameraTarget.dataset.connected = "true"
      }
      this.cameraTarget.classList.remove("hidden")
      setTimeout(() => {
        this.cameraTarget.classList.remove("opacity-0")
      });
    } else {
      this.cameraTarget.classList.add("opacity-0")
      setTimeout(() => {
        this.cameraTarget.classList.add("hidden")
      }, 1000);
    }
  }
}