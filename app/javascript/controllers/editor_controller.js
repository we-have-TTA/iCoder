import { Controller } from "stimulus"
import Rails from "@rails/ujs"
import { CodeJar } from "codejar"
import hljs from "highlight.js"
// Import line numbers helper.
import { withLineNumbers } from "codejar/linenumbers"
// Connects to data-controller="editor"
export default class extends Controller {
  static targets = ["panel", "draw", "change_language", "team_question", "team_name", "questions_list", "questions_information", "questions_code","questions_item", "Ruby", "Javascript", "Python", "Elixir", "instruction_choice", "code_choice", "questions_instruction"]
  connect() {
    // 目前編輯器語言
    this.panelTarget.className += " ruby"
    // Wrap highlighting function to show line numbers.
    const jar = CodeJar(
      this.panelTarget,
      withLineNumbers(hljs.highlightElement)
    )
    const str = `puts 123`
    jar.updateCode(str)

    this.toggleLanguageMenu()
  }

  run() {
    const language = document.getElementById("current_language").textContent
    const roomID = this.element.dataset.room_id
    const uuid = document.getElementById("web-console").dataset.roomuuid
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
    this.team_questionTarget.classList.contains("hidden")
    ? this.team_questionTarget.classList.remove("hidden")
    : this.team_questionTarget.classList.add("hidden")
    const roomID = this.element.dataset.room_id
    Rails.ajax({
      url: `/api/v1/rooms/${roomID}/catch_questions`,
      type: "get",
      success: (result) => {
        let html = ""
        this.team_nameTarget.textContent=`${result.team.name} questions`
        result.question.forEach((question) => {
          html += `<tr data-action="click->editor#displayQuestionsItem"
                       id=${question.id}
                       class="cursor-pointer"
                       data-editor-target="questions_item">
                     <td>
                       <div class="text-left font-bold">
                         ${question.title}
                       </div>
                       <div class="text-left">
                         ${question.internal_description}
                       </div>
                       <div class="text-left text-gray-600">
                         ${question.language}・By ${result.user[question.user_id-1].username}
                       </div>
                     </td>
                   </tr>`          
        })

        this.questions_listTarget.innerHTML = ""
        this.questions_listTarget.insertAdjacentHTML("afterbegin", html)
        
        
        // this.panelTarget.className += " ruby"
        // const jar = CodeJar(
        //   this.panelTarget,
        //   hljs.highlightElement
        // )
        // const str=`${result.question[0].code}`
        // jar.updateCode(str)
    

        // console.log(this.connect().CodeJar)
        

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
    for (let i = 0; i<questionItem.length; i++) {
      questionItem[i].classList.remove("bg-gray-200")
    }
    e.currentTarget.classList.add("bg-gray-200")
    Rails.ajax({
      url: `/api/v1/rooms/${roomID}/catch_questions`,
      type: "get",
      success: (result) => {
        const questionIdArr = result.question.map((question)=>question.id)
        const questionFind = questionIdArr.indexOf(Number(questionId))
        let informationHtml = `<div class=" border-b">
                                <div class=" font-bold text-lg px-5 py-3">
                                  ${result.question[questionFind].title}
                                </div>
                                <div class=" px-5 text-gray-600">
                                  ${result.question[questionFind].internal_description
                                  }
                                </div>
                                <div class=" px-5 pb-3 text-gray-600">
                                  Create At ${result.question[questionFind].created_at.split("T")[0]}
                                </div>
                              </div>
                              <div class=" border-t">
                                <span class=" pl-5 pt-1 inline-block">
                                  <span class="border-b py-2 inline-block text-gray-600 hover:border-gray-900 cursor-pointer"
                                        data-action="click->editor#displayCode"
                                        id=${questionFind}
                                        data-editor-target="code_choice">
                                    Code
                                  </span>
                                </span>
                                <span class=" pl-5 pt-1 inline-block">
                                  <span class="border-b py-2 inline-block text-gray-600 hover:border-gray-900 cursor-pointer"
                                        data-action="click->editor#displayInstruction"
                                        id=${questionFind}
                                        data-editor-target="instruction_choice">
                                    面試說明
                                  </span>
                                </span>
                              </div>
                              <div data-editor-target="questions_code"
                                   class="px-5 py-8 h-1/2 overflow-scroll">
                                ${result.question[questionFind].code}
                              </div>
                              <div class=" absolute bottom-2 w-full text-center"
                                   id=${questionFind}
                                   data-action="click->editor#addQuestion">
                                <button class=" mr-3 px-4 py-1 border rounded-md">編輯</button>
                                <button class=" mr-3 px-4 py-1 border rounded-md">加入</button>
                              </div>`
        this.questions_informationTarget.innerHTML = ""
        this.questions_informationTarget.insertAdjacentHTML("afterbegin", informationHtml)
        // // console.log(this)
        // this.panelTarget.className += " ruby"
        // const jar = CodeJar(
        //   this.panelTarget,
        //   hljs.highlightElement
        // )
        // const str=`${result.question[0].code}`
        // jar.updateCode(str)
    

        // console.log(this.connect().CodeJar)
        

      },
      error: (err) => {
        console.log(err)
      },
    })
  }

  displayCode (e) {
    const roomID = this.element.dataset.room_id
    const questionId = e.currentTarget.id
    this.code_choiceTarget.classList.add("text-blue-700","border-gray-900")
    this.instruction_choiceTarget.classList.remove("text-blue-700","border-gray-900")
    Rails.ajax({
      url: `/api/v1/rooms/${roomID}/catch_questions`,
      type: "get",
      success: (result) => {
        let codeHtml = `${result.question[questionId].code}`
        this.questions_codeTarget.innerHTML = ""
        this.questions_codeTarget.insertAdjacentHTML("afterbegin", codeHtml)
      },
      error: (err) => {
        console.log(err)
      },
    })
  }

  displayInstruction (e) {
    const roomID = this.element.dataset.room_id
    const questionId = e.currentTarget.id
    this.instruction_choiceTarget.classList.add("text-blue-700","border-gray-900")
    this.code_choiceTarget.classList.remove("text-blue-700","border-gray-900")
    Rails.ajax({
      url: `/api/v1/rooms/${roomID}/catch_questions`,
      type: "get",
      success: (result) => {
        let instructionHtml = `${result.question[questionId].candidate_instructions}`
        this.questions_codeTarget.innerHTML = ""
        this.questions_codeTarget.insertAdjacentHTML("afterbegin", instructionHtml)
      },
      error: (err) => {
        console.log(err)
      },
    })
  }

  addQuestion (e) {
    const roomID = this.element.dataset.room_id
    const questionId = e.currentTarget.id
    Rails.ajax({
      url: `/api/v1/rooms/${roomID}/catch_questions`,
      type: "get",
      success: (result) => {
      //   const toLanguage = result.question[questionId].language
      //   this.RubyTarget
        
      //  this.RubyTarget.click()
      //   var x = window['toLanguage']
        // console.log(x)
        const toLanguage = result.question[questionId].language
        const changeLanguage = {
          Ruby: this.RubyTarget,
          Javascript: this.JavascriptTarget,
          Python: this.PythonTarget,
          Elixir: this.ElixirTarget
        }
        changeLanguage[toLanguage].click()
        this.panelTarget.className += ` ${toLanguage}`
        const jar = CodeJar(
          this.panelTarget,
          hljs.highlightElement
        )
        const str=`${result.question[questionId].code}`
        jar.updateCode(str)
        this.team_questionTarget.classList.add("hidden")
        this.questions_instructionTarget.classList.remove("hidden")
        this.questions_instructionTarget.textContent=`面試說明：${result.question[questionId].candidate_instructions}`
      },
      error: (err) => {
        console.log(err)
      },
    })
  }

  close () {
    this.team_questionTarget.classList.add("hidden")
  }
}
