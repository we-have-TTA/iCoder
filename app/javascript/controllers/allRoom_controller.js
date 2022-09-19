import { Controller } from "stimulus"
import consumer from "../channels/consumer"

export default class extends Controller {
  static targets =["camera", "chat"]
  connect() {
    
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

  displayChat() {
    if (this.chatTarget.classList.contains("hidden")) {
      this.chatTarget.classList.remove("hidden")
      this.chatTarget.classList.remove("scale-x-0")
      setTimeout(() => {
        this.chatTarget.classList.remove("opacity-0")
        this.chatTarget.classList.add("scale-y-100")
      });
    } else {
      this.chatTarget.classList.add("opacity-0")
      this.chatTarget.classList.remove("scale-y-100")
      this.chatTarget.classList.add("scale-x-0")
      setTimeout(() => {
        this.chatTarget.classList.add("hidden")
      }, 1000);
    }
  }
}