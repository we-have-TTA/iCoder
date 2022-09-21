import { Controller } from "stimulus"
import Rails from "@rails/ujs"
import consumer from "../channels/consumer"
import { CodeJar } from "codejar"
import hljs from "highlight.js"
// Import line numbers helper.

export default class extends Controller {
  static targets = ["panel"]

  _cableConnected() {
    // Called when the subscription is ready for use on the server
    console.log(`runCode connected`)
  }

  _cableDisconnected() {
    // Called when the subscription has been terminated by the server
  }

  _cableReceived(data) {
    // Called when there's incoming data on the websocket for this channel
    // 自己發出的訊息不處理
    if (data.action == "selectLanguage"){
      this.selectLanguage(data)
      return
    }
      this.runCode(data)
    
  }

  run() {
    const language = this.getLanguage()
    const roomID = this.element.dataset.room_id
    const uuid = this.getRoomUUID()
    const username = localStorage["username"]
    const _jar = CodeJar(this.panelTarget, hljs.highlightElement)
    const strArray = _jar.toString()
    _jar.destroy()

    const data = {
      code: strArray,
      language: language,
      uuid: uuid,
      username: username
    }

    Rails.ajax({
      url: `/api/v1/rooms/${roomID}/run`,
      type: "post",
      data: new URLSearchParams(data).toString(),
      success: () => {
      },
      error: (err) => {
        console.log(err)
      },
    })
  }

  runCode({result, nickname}){
    const resultText = document.getElementById("run_result")
    const runText = document.getElementById("run-text")
    const resultBox = document.getElementById("result-box")
    resultText.textContent = ""
    runText.textContent = `${nickname} 執行了程式碼：`
    resultBox.style.cssText = "display: block"
    resultText.textContent = result
    setTimeout(() => {
      resultBox.style.cssText = "display: none"
    }, 5000)
  }

  
  selectLanguage({language,new_container}) {
    const iframe = document.getElementById("iframe").contentWindow
    iframe.postMessage(`reload`, this.element.dataset.src)
    document.getElementById("current_language").textContent = language
    if (sessionStorage["admin"] === "true"){
      setTimeout(() => {
        iframe.postMessage(`${new_container}`, this.element.dataset.src)
      }, 500);
    } else {
      setTimeout(() => {
        iframe.postMessage(`${new_container}`, this.element.dataset.src)
      }, 1500);
    }
  }

  getRoomUUID() {
    return (this.element.dataset.roomuuid)
  }

  getLanguage() {
    return document.getElementById("current_language").textContent
  }


  connect() {
    this.channel = consumer.subscriptions.create(
      {
        channel: "RoomRunChannel",
        uuid: this.getRoomUUID(),
      },
      {
        connected: this._cableConnected.bind(this),
        disconnected: this._cableDisconnected.bind(this),
        received: this._cableReceived.bind(this),
      }
    )
  }

  

}
