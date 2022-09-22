import { Controller } from "stimulus"
import e from "trix"
import consumer from "../channels/consumer"

export default class extends Controller {
  static targets =["camera", "chat", "RUN", "terminal", "iframe", "timer"]
  connect() {
    let duration_Time = 1
    setInterval(()=> {
      duration_Time += 1
      let sec = String(parseInt(duration_Time % 60)).padStart(2,'0')
      let min = String(parseInt((duration_Time / 60) % 60)).padStart(2,'0')
      let hr = String(parseInt(duration_Time / 60 / 60)).padStart(2,'0')
      this.timerTarget.textContent = `${hr}:${min}:${sec}`
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

  displayChat() {
    if (this.chatTarget.classList.contains("hidden")) {
      this.chatTarget.classList.remove("hidden")
      setTimeout(() => {
        this.chatTarget.classList.remove("opacity-0")
        this.chatTarget.classList.add("scale-x-100")
        this.chatTarget.classList.add("scale-y-100")
        this.chatTarget.classList.remove("-translate-x-12")
        this.chatTarget.classList.remove("translate-y-48")
      });
    } else {
      this.chatTarget.classList.add("opacity-0")
      this.chatTarget.classList.remove("scale-y-100")
      this.chatTarget.classList.remove("scale-x-100")
      this.chatTarget.classList.add("scale-x-0")
      this.chatTarget.classList.add("-translate-x-12")
      this.chatTarget.classList.add("translate-y-48")
      setTimeout(() => {
        this.chatTarget.classList.add("hidden")
      }, 800);
    }
  }

  displayRUN(e) {
    this.terminalTarget.classList.remove("text-white","border-2","border-b-0","border-gray-300")
    this.terminalTarget.classList.add("text-gray-400","border-b","border-gray-500","hover:border-gray-200")
    e.target.classList.remove("text-gray-400","border-b","border-gray-500","hover:border-gray-200")
    e.target.classList.add("text-white","border-2","border-b-0","border-gray-400")
    this.iframeTarget.classList.remove("z-10")
  }

  displayTerminal(e) {
    this.RUNTarget.classList.remove("text-white","border-2","border-b-0","border-gray-400")
    this.RUNTarget.classList.add("text-gray-400","border-b","border-gray-500","hover:border-gray-200")
    e.target.classList.remove("text-gray-400","border-b","border-gray-500","hover:border-gray-200")
    e.target.classList.add("text-white","border-2","border-b-0","border-gray-400")
    this.iframeTarget.classList.add("z-10")
  }

}