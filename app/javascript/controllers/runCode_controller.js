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

    const resultBox = document.getElementById("result")
    console.log(result)
    let color = "gold"
    if( localStorage["username"] === nickname){
      color = "cyan"
    }
    let answer = "text-gray-200"
    let answerBg = "bg-gray-700"


    // const container = document.getElementById('message0')
    // const data = '與 setTimeout 相比，requestAnimationFrame 最大的優勢是 由系統來決定回撥函式的執行時機。具體一點講就是，系統每次繪製之前會主動呼叫 requestAnimationFrame 中的回撥函式，如果系統繪製率是 60Hz，那麼回撥函式就每16.7ms 被執行一次，如果繪製頻率是75Hz，那麼這個間隔時間就變成了 1000/75=13.3ms。換句話說就是，requestAnimationFrame 的執行步伐跟著系統的繪製頻率走。它能保證回撥函式在螢幕每一次的繪製間隔中只被執行一次，這樣就不會引起丟幀現象，也不會導致動畫出現卡頓的問題。'.split('')
    
    
    console.log(color)
    if (result == "") {
      resultBox.insertAdjacentHTML("beforeend", `<br><div class=" bg-gray-700 border-2 text-gray-400 border-gray-400 ring-2 ring-gray-300 p-2 ml-2 block">空的回傳值</div>`)
      document.getElementById("result").scrollTop=document.getElementById("result").scrollHeight
      return
    } else if (result !== undefined) {
      if ( result.split("/")[0] === "root" || result.split("/")[1] === "root" || result.split(" ")[0] === "Traceback" || result.split(" ")[0] === "warning:") {
        answer = "text-red-600"
        answerBg = "bg-gray-300"
      }
      resultBox.insertAdjacentHTML("beforeend", `<br><div class="${answerBg} border-2 ${answer} border-gray-400 ring-2 ring-gray-300 p-2 ml-2 block">${result}</div>`)
      document.getElementById("result").scrollTop=document.getElementById("result").scrollHeight
      return
    }
    const rndId = Math.ceil(Math.random()*2000)
    resultBox.insertAdjacentHTML("beforeend", `<br><div id="${rndId}" style="color: ${color}"></div>`)
    let index = 0
    const data = `${nickname} 執行了程式碼`
    function writing() {
      if (index < data.length) {
        document.getElementById(`${rndId}`).innerHTML += data[index ++]
        setTimeout(() => {
          requestAnimationFrame(writing)
        }, 1000/50);
      }
    }
    writing()
    
    document.getElementById("result").scrollTop=document.getElementById("result").scrollHeight

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
