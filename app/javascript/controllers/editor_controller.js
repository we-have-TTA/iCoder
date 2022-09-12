import { Controller } from "stimulus"
import Rails from "@rails/ujs"
import { CodeJar } from "codejar"
import hljs from "highlight.js"
// Import line numbers helper.
import { withLineNumbers } from "codejar/linenumbers"

export default class extends Controller {
  static targets = ["panel", "draw", "change_language", "team_name", "questions_list", "questions_information"]
  connect() {
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

    // this.toggleLanguageMenu()
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

  // catchQuestions(e) {
  //   const roomID = this.element.dataset.room_id
  //   Rails.ajax({
  //     url: `/api/v1/rooms/${roomID}/catch_questions`,
  //     type: "get",
  //     success: (result) => {
  //       // console.log(result.question)
  //       // console.log(result.team)
  //       console.log(e)
  //       let html = ""
  //       this.team_nameTarget.textContent=`${result.team.name} questions`
  //       result.question.forEach((question) => {
  //         html += `<tr>
  //                    <td data-action="click->editor#catchQuestions"
  //                        data-editor-target="question_information"
  //                        id=${question.id}>
  //                      <div class="text-left font-bold">
  //                        ${question.title}
  //                      </div>
  //                      <div class="text-left">
  //                        ${question.internal_description}
  //                      </div>
  //                      <div class="text-left">
  //                        ${question.language}・By ${result.user[question.user_id-1].username}
  //                      </div>
  //                    </td>
  //                  </tr>`
          
          
  //       })
  //       // document.getElementById("list").addEventListener("click", (e)=> {
  //       //   console.log(e.currentTarget)
  //       // })
  //       this.questions_listTarget.innerHTML = ""
  //       this.questions_listTarget.insertAdjacentHTML("afterbegin", html)
  //       let informationHtml = ""
  //       console.log(this)
        
  //       informationHtml = `<div class=" border">
  //                            <div class=" font-bold px-5 py-3">
  //                              ${result.question[0].title}
  //                            </div>
  //                            <div class=" px-5">
  //                              ${result.question[0].internal_description
  //                              }
  //                            </div>
  //                            <div class=" px-5 pb-3">
  //                              ${result.question[0].created_at}
  //                            </div>
  //                          </div>
  //                          <div class=" border-l border-r">
  //         <span class=" pl-5 pt-1 inline-block"><span class="border-b py-2 inline-block hover:border-gray-900">給面試者的訊息</span></span>
  //         <span class=" pl-5 pt-1 inline-block"><span class="border-b py-2 inline-block hover:border-gray-900">Code</span></span>
  //       </div>
  //       <div class="px-5 py-8">
  //         ${result.question[0].code}
  //       </div>`
        
  //       // this.questions_informationTarget.innerHTML = ""
  //       // this.questions_informationTarget.insertAdjacentHTML("afterbegin", informationHtml)
  //       // // console.log(this)
  //       // this.panelTarget.className += " ruby"
  //       // const jar = CodeJar(
  //       //   this.panelTarget,
  //       //   hljs.highlightElement
  //       // )
  //       // const str=`${result.question[0].code}`
  //       // jar.updateCode(str)
    

  //       // console.log(this.connect().CodeJar)
        

  //     },
  //     error: (err) => {
  //       console.log(err)
  //     },
  //   })
  // }
}
