import { Controller } from "stimulus"
import Rails from "@rails/ujs"
import { CodeJar } from "codejar"
import hljs from "highlight.js"
// Import line numbers helper.
import { withLineNumbers } from "codejar/linenumbers"

export default class extends Controller {
  static targets = ["panel", "draw", "change_language"]
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

  catchQuestions() {
    const roomID = this.element.dataset.room_id
    Rails.ajax({
      url: `/api/v1/rooms/${roomID}/catchQuestions`,
      type: "get",
      success: (result) => {
        console.log(result)
        result.forEach((question) => {
          console.log(question.title)
        })
      },
      error: (err) => {
        console.log(err)
      },
    })
  }
}
