import { Controller } from "stimulus"
import Rails from "@rails/ujs"
import { CodeJar } from "codejar"
import hljs from "highlight.js"
// Import line numbers helper.
import { withLineNumbers } from "codejar/linenumbers"
import consumer from "../channels/consumer"

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

  getuuid() {
    return (sessionStorage["room-uuid"] ||=
      document.getElementById("web-console").dataset.roomuuid)
  }

  getLanguage() {
    return (sessionStorage["room-language"] ||=
      document.getElementById("current_language").textContent)
  }

  getSessionID() {
    return (sessionStorage["sessionID"] ||= self.crypto.randomUUID())
  }

  _cableConnected() {
    // Called when the subscription is ready for use on the server
    console.log("stimulus connected")
  }

  _cableDisconnected() {
    // Called when the subscription has been terminated by the server
  }

  _cableReceived({ sessionID, type, body }) {
    // Called when there's incoming data on the websocket for this channel
    console.log("stimulus received data")
    if (sessionStorage["sessionID"] === sessionID) {
      return
    }

    if (type === "code") {
      CodeJar(this.panelTarget, hljs.highlightElement).updateCode(body.code)
    }
  }

  connect() {
    this.channel = consumer.subscriptions.create("RoomChannel", {
      connected: this._cableConnected.bind(this),
      disconnected: this._cableDisconnected.bind(this),
      received: this._cableReceived.bind(this),
    })

    const questionId = this.element.dataset.questionId
    if (questionId) {
      Rails.ajax({
        url: `/api/v1/questions/${questionId}.json`,
        type: "get",
        success: ({ language, code }) => {
          this.panelTarget.className += ` ${language}`
          const jar = CodeJar(
            this.panelTarget,
            withLineNumbers(hljs.highlightElement)
          )
          jar.updateCode(code)
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
          },
          error: () => {},
        })
      } else {
        this.panelTarget.className += ` rb`
        CodeJar(this.panelTarget, withLineNumbers(hljs.highlightElement))
      }
    }

    CodeJar(this.panelTarget, hljs.highlightElement).onUpdate((code) => {
      const uuid = this.getuuid()
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
        success: () => {
          console.log("ok")
        },
        error: () => {
          console.log("no")
        },
      })
    })
    this.toggleLanguageMenu()
  }

  transCode(e) {
    const jar = CodeJar(this.panelTarget, hljs.highlightElement)
    const field = document.createElement("input")
    field.setAttribute("type", "hidden")
    field.setAttribute("name", "question[code]")
    field.setAttribute("value", jar.toString())
    this.element.appendChild(field)
    this.element.submit()
  }

  changeLanguage(e) {
    this.panelTarget.className = `editor ${e.target.value}`
    CodeJar(this.panelTarget, hljs.highlightElement)
  }

  run() {
    const language = getLanguage()
    const roomID = this.element.dataset.room_id
    const uuid = getuuid()
    const jar = CodeJar(this.panelTarget, hljs.highlightElement)
    const strArray = jar.toString()
    const data = {
      code: strArray,
      language: language,
      uuid: uuid,
    }
    const resultText = document.getElementById("run_result")
    const resultBox = document.getElementById("result-box")
    const runText = document.getElementById("run-text")
    resultText.textContent = ""
    runText.textContent = "執行中....."
    resultBox.style.cssText = "display: block"
    Rails.ajax({
      url: `/api/v1/rooms/${roomID}/run`,
      type: "post",
      data: new URLSearchParams(data).toString(),
      success: ({ result }) => {
        runText.textContent = "執行結果："
        resultText.textContent = result
        setTimeout(() => {
          resultBox.style.cssText = "display: none"
        }, 5000)
      },
      error: (err) => {
        console.log(err)
      },
    })
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
        let cardMove = -30
        this.team_nameTarget.textContent = `${result.team.name} 的題庫`
        result.question.forEach((question) => {
          cardMove += 30
          html += `<tr data-action="click->editor#displayQuestionsItem"
                       id=${question.id}
                       class="transition duration-300 cursor-pointer bg-white hover:bg-gray-100 transform hover:-translate-y-5 hover:translate-x-2 hover:scale-105 mx-4 block relative right-2 rounded-md rounded-tr-2xl"
                       style="box-shadow: 2px 3px 2px 0 rgb(0 0 0 / 14%), 0 0 5px 0 rgb(0 0 0 / 12%), 0 3px 1px -2px rgb(0 0 0 / 20%); bottom:${cardMove}px"
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
                         By ${result.user[question.user_id - 1].username}
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
                                   <button class=" mr-3 px-4 py-1 border rounded-md hover:bg-gray-100">
                                     編輯
                                   </button>
                                 </a>
                                 <button class=" mr-3 px-4 py-1 border rounded-md hover:bg-gray-100"
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
      url: `/api/v1/rooms/${roomID}/catch_questions`,
      type: "get",
      success: (result) => {
        const toLanguage = result.question[questionId].language
        const changeLanguage = {
          Ruby: this.RubyTarget,
          Javascript: this.JavascriptTarget,
          Python: this.PythonTarget,
          Elixir: this.ElixirTarget,
        }
        changeLanguage[toLanguage].click()
        this.panelTarget.className = `editor ${toLanguage}`
        const jar = CodeJar(this.panelTarget, hljs.highlightElement)
        const str = `${result.question[questionId].code}`
        jar.updateCode(str)
        this.team_questionTarget.classList.add("hidden")
        this.questions_instructionTarget.classList.remove("hidden")
        this.questions_instructionTarget.textContent = `面試說明：\n        ${result.question[questionId].candidate_instructions}`
      },
      error: (err) => {
        console.log(err)
      },
    })
  }

  close(e) {
    console.log(e.target.dataset.action)
    if (e.target.dataset.action === "click->editor#close") {
      this.questions_displayTarget.classList.remove("translate-y-36")
      this.questions_displayTarget.classList.add("opacity-0")
      setTimeout(() => {
        this.team_questionTarget.classList.add("hidden")
      }, 500)
    }
  }
}
