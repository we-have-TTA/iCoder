import { Controller } from "stimulus"
import Rails from "@rails/ujs"
import consumer from "../channels/consumer"
import { CodeJar } from "codejar"
import hljs from "highlight.js"
// Import line numbers helper.

export default class extends Controller {
  static targets = ["panel"]

  _cableConnected() {}

  _cableDisconnected() {}

  _cableReceived(data) {
    if (data.action == "selectLanguage") {
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
      username: username,
    }

    Rails.ajax({
      url: `/api/v1/rooms/${roomID}/run`,
      type: "post",
      data: new URLSearchParams(data).toString(),
      success: () => {},
      error: (err) => {
        console.log(err)
      },
    })
  }

  runCode({ result, nickname }) {
    const resultBox = document.getElementById("result")
    let color = "gold"
    let answer = "text-gray-200"
    let answerBg = "bg-gray-700"

    if (localStorage["username"] === nickname) {
      color = "cyan"
    }
    if (result == "") {
      resultBox.insertAdjacentHTML(
        "beforeend",
        `<br><div class=" bg-gray-700 border-2 text-gray-400 border-gray-400 ring-2 ring-gray-300 p-2 ml-2 block">空的回傳值</div>`
      )
      document.getElementById("result").scrollTop =
        document.getElementById("result").scrollHeight
      return
    } else if (result !== undefined) {
      if (
        result.split("/")[0] === "root" ||
        result.split("/")[1] === "root" ||
        result.split(" ")[0] === "Traceback" ||
        result.split(" ")[0] === "warning:" ||
        result.split(" ")[0] === "File" ||
        result.split(" ")[0] === "**"
      ) {
        answer = "text-red-600"
        answerBg = "bg-gray-300"
      }
      resultBox.insertAdjacentHTML(
        "beforeend",
        `<br><div class="${answerBg} border-2 ${answer} border-gray-400 ring-2 ring-gray-300 p-2 ml-2 block">${result}</div>`
      )
      document.getElementById("result").scrollTop =
        document.getElementById("result").scrollHeight
      return
    }
    const rndId = Math.ceil(Math.random() * 2000)
    resultBox.insertAdjacentHTML(
      "beforeend",
      `<br><div id="${rndId}" style="color: ${color}"></div>`
    )
    let index = 0
    const data = `${nickname} 執行了程式碼`
    function writing() {
      if (index < data.length) {
        document.getElementById(`${rndId}`).innerHTML += data[index++]
        setTimeout(() => {
          requestAnimationFrame(writing)
        }, 1000 / 50)
      }
    }
    writing()

    document.getElementById("result").scrollTop =
      document.getElementById("result").scrollHeight
  }

  selectLanguage({ language }) {
    document.getElementById("current_language").textContent = language
  }

  getRoomUUID() {
    return this.element.dataset.roomuuid
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
