import { Controller } from "stimulus"
import Rails from "@rails/ujs"
import { CodeJar } from "codejar"
import hljs from "highlight.js"
import { withLineNumbers } from "codejar/linenumbers"

export default class extends Controller {
  static targets = ["panel"]

  connect() {
    console.log("OK")
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
        },
        error: () => {},
      })
    } else {
        setTimeout(() => {
          this.panelTarget.className = "editor rb"
          CodeJar(this.panelTarget, withLineNumbers(hljs.highlightElement))
        }, 0)
      }
  }

  questionFormSelectLanguage(e) {
    this.changeLanguage(e.target.value)
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
}
