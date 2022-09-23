import { Controller } from "stimulus"
import Rails from "@rails/ujs"
import { CodeJar } from "codejar"
import hljs from "highlight.js"
// Import line numbers helper.
import { withLineNumbers } from "codejar/linenumbers"
import consumer from "../channels/consumer"
import { v4 as uuidv4 } from "uuid"

export default class extends Controller {
  static targets = [
    "panel",
    "draw",
    "change_language",
    "team_question",
    "team_name",
    "questions_list",
    "questions_information",
    "questions_code",
    "questions_item",
    "Ruby",
    "Javascript",
    "Python",
    "Elixir",
    "instruction_choice",
    "code_choice",
    "questions_instruction",
    "questions_display",
  ]

  getRoomUUID() {
    return (sessionStorage["room-uuid"] ||= this.element.dataset.roomuuid)
  }

  getLanguage() {
    return document.getElementById("current_language").textContent
  }

  getSessionID() {
    return (sessionStorage["sessionID"] ||= uuidv4())
  }

  getSignedStatus() {
    return (sessionStorage["admin"]) ||= this.element.dataset.signed
  }

  _cableConnected() {
    // Called when the subscription is ready for use on the server

  }

  _cableDisconnected() {
    // Called when the subscription has been terminated by the server
  }

  _cableReceived({ sessionID, code }) {
    // Called when there's incoming data on the websocket for this channel
    // 自己發出的訊息不處理

    if (sessionStorage["sessionID"] === sessionID) {
      return
    }

    const jar = CodeJar(this.panelTarget, hljs.highlightElement)

    // 編輯器更新資料
    jar.updateCode(code.content)

    // 回復游標位置
    if (sessionStorage["cursor_position"]) {
      jar.restore(JSON.parse(sessionStorage["cursor_position"]))
    }

    jar.destroy()
  }

  connect() {
    this.getSignedStatus()
    this.channel = consumer.subscriptions.create(
      {
        channel: "RoomEditorChannel",
        uuid: this.getRoomUUID(),
        sessionID: this.getSessionID(),
      },
      {
        connected: this._cableConnected.bind(this),
        disconnected: this._cableDisconnected.bind(this),
        received: this._cableReceived.bind(this),
      }
    )

    const questionId = this.element.dataset.questionId
    if (questionId) {
      Rails.ajax({
        url: `/api/v1/questions/${questionId}.json`,
        type: "get",
        success: ({ language, code }) => {
          this.panelTarget.className = `editor ${language}`
          const jar = CodeJar(
            this.panelTarget,
            withLineNumbers(hljs.highlightElement)
          )
          jar.updateCode(code)
          jar.destroy()
          if (this.panelTarget.dataset.edit == "false") {
            this.panelTarget.setAttribute("contenteditable", false)
          }
          this.webConsoleChangeLanguage(language)
        },
        error: () => {},
      })
    } else {
      const LOAD_FROM_EXAMPLE = false
      if (LOAD_FROM_EXAMPLE) {
        Rails.ajax({
          url: "/api/v1/questions/example/1",
          type: "get",
          success: ({ language, code }) => {
            this.panelTarget.className += ` ${language}`
            const jar = CodeJar(
              this.panelTarget,
              withLineNumbers(hljs.highlightElement)
            )
            jar.updateCode(code)
            this.webConsoleChangeLanguage("Ruby")
          },
          error: () => {},
        })
      } else {
        setTimeout(() => {
          this.webConsoleChangeLanguage("Ruby")
          this.panelTarget.className = "editor rb"
          CodeJar(this.panelTarget, withLineNumbers(hljs.highlightElement))
        }, 0)
      }
    }

    // 當使用者更動了編輯器的內容時，發出一個請求，內容包括
    //   1. 更動後的內容
    //   2. 目前所在的 room
    //   3. 目前所使用的程式語言（之後會在model:room 上開欄位紀錄）
    //   4. sessionID 識別哪個瀏覽器分頁發出的請求（稍後接受到廣播訊息時可以忽略自己發出的訊息）
    //   5. 請求送往 api::v1::questions#send_code
    //      內容有
    //        1. 嘗試紀錄接收內容於資料庫 Code.new
    //        2.   如果最近一筆資料在五秒內建立的話，不紀錄於資料庫
    //        3. 對該房間的頻道訂閱者廣播訊息
    //           內容有
    //             1. sessionID
    //             2. code 物件
    //                前端接收到廣播訊息後渲染至編輯器上（別人打的 code 同步在自己畫面上）
    const _jar = CodeJar(this.panelTarget, hljs.highlightElement)
    _jar.onUpdate((code) => {
      const uuid = this.getRoomUUID()
      const data = {
        code: code,
        language: this.getLanguage(),
        uuid: uuid,
        sessionID: this.getSessionID(),
      }
      Rails.ajax({
        url: `/api/v1/rooms/${uuid}/code`,
        type: "post",
        data: new URLSearchParams(data).toString(),
        success: () => {},
        error: () => {},
      })
      sessionStorage["cursor_position"] = JSON.stringify(_jar.save())
    })

    this.toggleLanguageMenu()
  }

  transCode() {
    const field = document.createElement("input")
    field.setAttribute("type", "hidden")
    field.setAttribute("name", "question[code]")

    const jar = CodeJar(this.panelTarget, hljs.highlightElement)
    field.setAttribute("value", jar.toString())
    jar.destroy()

    this.element.appendChild(field)
    this.element.submit()
  }

  changeLanguage(language) {
    this.panelTarget.className = `editor ${language}`
    const _jar = CodeJar(this.panelTarget, hljs.highlightElement)
    _jar.destroy()
  }

  webConsoleChangeLanguage(language) {
    const changeLanguageDict = {
      Ruby: this.RubyTarget,
      Javascript: this.JavascriptTarget,
      Python: this.PythonTarget,
      Elixir: this.ElixirTarget,
    }
    if (sessionStorage["admin"] === "true") {
      changeLanguageDict[language].click()
      return
    }
    const iframe = document.getElementById("iframe").contentWindow
    iframe.postMessage(`${this.element.dataset.roomuuid}-${language}`, this.element.dataset.src)
    document.getElementById("current_language").textContent = language
  }

  

  toggleLanguageMenu() {
    this.change_languageTarget.classList.contains("hidden")
      ? this.change_languageTarget.classList.remove("hidden")
      : this.change_languageTarget.classList.add("hidden")
  }

  toggleInformation() {
    this.questions_instructionTarget.classList.contains("hidden")
      ? this.questions_instructionTarget.classList.remove("hidden")
      : this.questions_instructionTarget.classList.add("hidden")
  }

  catchQuestions() {
    this.team_questionTarget.classList.remove("hidden")
    setTimeout(() => {
      this.questions_displayTarget.classList.add("translate-y-36")
      this.questions_displayTarget.classList.remove("opacity-0")
    }, 100)
    const roomID = this.element.dataset.room_id
    Rails.ajax({
      url: `/api/v1/rooms/${roomID}/catch_questions`,
      type: "get",
      success: (result) => {
        let html = ""
        let cardMove = -32
        this.team_nameTarget.textContent = `${result.team.name} 的題庫`
        result.question.forEach((question) => {
          const userFind = result.user.reduce((acc,cv,index) => {
                             if (cv.id === question.user_id) { 
                                return index
                             } return acc
                           },0)
          cardMove += 32
          html += `<tr data-action="click->editor#displayQuestionsItem"
                       id=${question.id}
                       class="transition duration-300 cursor-pointer bg-white hover:bg-gray-100 transform hover:-translate-y-5 hover:translate-x-2 hover:scale-105 mx-4 block relative right-2 rounded-md rounded-tr-2xl box-shadow"
                       style="bottom:${cardMove}px"
                       data-editor-target="questions_item">
                     <td class=" border-white">
                       <div class="text-left font-bold">
                         ${question.title}
                       </div>
                       <div class="text-left text-gray-600">
                         ${question.internal_description}
                       </div>
                       <div class="text-left text-gray-600">
                         ${question.language}
                       </div>
                       <div class="text-left text-gray-600">
                         By ${result.user[userFind].username}
                       </div>
                     </td>
                   </tr>`
        })
        this.questions_listTarget.innerHTML = ""
        this.questions_listTarget.insertAdjacentHTML("afterbegin", html)
      },
      error: (err) => {
        console.log(err)
      },
    })
  }

  displayQuestionsItem(e) {
    const roomID = this.element.dataset.room_id
    const questionId = e.currentTarget.id
    const questionItem = this.questions_itemTargets
    for (let i = 0; i < questionItem.length; i++) {
      questionItem[i].classList.remove(
        "bg-gray-200",
        "-translate-y-5",
        "translate-x-3",
        "scale-105"
      )
      questionItem[i].classList.add("hover:bg-gray-100", "hover:translate-x-2")
    }
    e.currentTarget.classList.remove("hover:bg-gray-100", "hover:translate-x-2")
    e.currentTarget.classList.add(
      "bg-gray-200",
      "-translate-y-5",
      "translate-x-3",
      "scale-105"
    )
    Rails.ajax({
      url: `/api/v1/rooms/${roomID}/catch_questions`,
      type: "get",
      success: (result) => {
        const questionIdArr = result.question.map((question) => question.id)
        const questionFind = questionIdArr.indexOf(Number(questionId))
        let informationHtml = `<div class=" border-b" style="height: 20%">
                                 <div class=" font-bold text-lg px-5 py-3">
                                   ${result.question[questionFind].title}
                                 </div>
                                 <div class=" px-5 text-gray-600">
                                   ${
                                     result.question[questionFind]
                                       .internal_description
                                   }
                                 </div>
                                 <div class=" px-5 pb-3 text-gray-600">
                                   Create At ${
                                     result.question[
                                       questionFind
                                     ].created_at.split("T")[0]
                                   }
                                 </div>
                               </div>
                               <div class=" border-t" style="height: 10%">
                                 <span class=" pl-5 pt-1 inline-block">
                                   <span class="transition duration-700 border-b py-2 inline-block text-gray-600 hover:border-gray-900 cursor-pointer"
                                         data-action="click->editor#displayCode"
                                         id=${questionFind}
                                         data-editor-target="code_choice">
                                     Code
                                   </span>
                                 </span>
                                 <span class=" pl-5 pt-1 inline-block">
                                   <span class="transition duration-700 border-b py-2 inline-block text-gray-600 hover:border-gray-900 cursor-pointer"
                                         data-action="click->editor#displayInstruction"
                                         id=${questionFind}
                                         data-editor-target="instruction_choice">
                                     面試說明
                                   </span>
                                 </span>
                               </div>
                               <div class="question-codejar-wrap p-2 pl-4" style="height:55%">
                                 <div data-editor-target="questions_code">
                                   ${result.question[questionFind].code}
                                 </div>
                               </div>
                               <div class=" w-full text-center relative"
                                    style="height: 15%"
                                    id=${questionFind}>
                                 <div class=" absolute h-1/2 top-0 bottom-0 left-0 right-0 m-auto">
                                 <a href="/dashboard/questions/${
                                   result.question[questionFind].id
                                 }/edit" target="_blank">
                                   <button class="btn-dashboard-border">
                                     編輯
                                   </button>
                                 </a>
                                 <button class="btn-dashboard-border"
                                         data-action="click->editor#addQuestion"
                                         id=${questionFind}>
                                   加入
                                 </button>
                                 </div>
                               </div>`
        this.questions_informationTarget.innerHTML = ""
        this.questions_informationTarget.insertAdjacentHTML(
          "afterbegin",
          informationHtml
        )
        this.questions_codeTarget.className = `editor ${result.question[questionFind].language}`
        const jar = CodeJar(this.questions_codeTarget, hljs.highlightElement)
        const str = `${result.question[questionFind].code}`
        jar.updateCode(str)
        jar.destroy()
        this.questions_codeTarget.setAttribute("contenteditable", false)
      },
      error: (err) => {
        console.log(err)
      },
    })
  }

  displayCode(e) {
    const roomID = this.element.dataset.room_id
    const questionId = e.currentTarget.id
    this.code_choiceTarget.classList.remove("border-b")
    this.code_choiceTarget.classList.add(
      "text-blue-700",
      "border-gray-900",
      "border-b-2"
    )
    this.instruction_choiceTarget.classList.remove(
      "text-blue-700",
      "border-gray-900",
      "border-b-2"
    )
    this.instruction_choiceTarget.classList.add("border-b")
    Rails.ajax({
      url: `/api/v1/rooms/${roomID}/catch_questions`,
      type: "get",
      success: (result) => {
        this.questions_codeTarget.className = `editor ${result.question[questionId].language}`
        const jar = CodeJar(this.questions_codeTarget, hljs.highlightElement)
        const str = `${result.question[questionId].code}`
        jar.updateCode(str)
        jar.destroy()
        this.questions_codeTarget.setAttribute("contenteditable", false)
      },
      error: (err) => {
        console.log(err)
      },
    })
  }

  displayInstruction(e) {
    const roomID = this.element.dataset.room_id
    const questionId = e.currentTarget.id
    this.instruction_choiceTarget.classList.remove("border-b")
    this.instruction_choiceTarget.classList.add(
      "text-blue-700",
      "border-gray-900",
      "border-b-2"
    )
    this.code_choiceTarget.classList.remove(
      "text-blue-700",
      "border-gray-900",
      "border-b-2"
    )
    this.code_choiceTarget.classList.add("border-b")
    Rails.ajax({
      url: `/api/v1/rooms/${roomID}/catch_questions`,
      type: "get",
      success: (result) => {
        this.questions_codeTarget.className = `editor ${result.question[questionId].language}`
        const jar = CodeJar(this.questions_codeTarget, hljs.highlightElement)
        const str = `${result.question[questionId].candidate_instructions}`
        jar.updateCode(str)
        jar.destroy()
        this.questions_codeTarget.setAttribute("contenteditable", false)
      },
      error: (err) => {
        console.log(err)
      },
    })
  }

  addQuestion(e) {
    const roomID = this.element.dataset.room_id
    const questionId = e.currentTarget.id
    Rails.ajax({
      url: `/api/v1/rooms/${roomID}/question/${questionId}`,
      type: "get",
      success: ({ language, code, candidate_instructions }) => {
        this.webConsoleChangeLanguage(language)
        this.panelTarget.classList.add(language)
        const jar = CodeJar(this.panelTarget, hljs.highlightElement)
        jar.updateCode(code)
        jar.destroy()
        this.team_questionTarget.classList.add("hidden")
        this.questions_instructionTarget.classList.remove("hidden")
        this.questions_instructionTarget.textContent = `面試說明：\n${candidate_instructions}`
      },
      error: (err) => {
        console.log(err)
      },
    })
  }

  close(e) {
    if (e.target.dataset.action === "click->editor#close") {
      this.questions_displayTarget.classList.remove("translate-y-36")
      this.questions_displayTarget.classList.add("opacity-0")
      setTimeout(() => {
        this.team_questionTarget.classList.add("hidden")
      }, 500)
    }
  }
}
