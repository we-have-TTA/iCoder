import { Controller } from "stimulus"
import Rails from "@rails/ujs"
import { CodeJar } from "codejar"
import hljs from "highlight.js"
// Import line numbers helper.
import { withLineNumbers } from "codejar/linenumbers"
// Connects to data-controller="editor"
export default class extends Controller {
  static targets = ["panel", "draw", "change_language"]
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

  catchQuestions() {
    const roomID = this.element.dataset.room_id
    Rails.ajax({
      url: `/api/v1/rooms/${roomID}/catch_questions`,
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
