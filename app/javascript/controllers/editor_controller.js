import { Controller } from "@hotwired/stimulus"
import Rails from "@rails/ujs"
import { CodeJar } from "codejar"
import hljs from "highlight.js"
// Import line numbers helper.
import { withLineNumbers } from "codejar/linenumbers"
// Connects to data-controller="editor"
export default class extends Controller {
  static targets = ["panel", "run", "draw"]
  connect() {
    console.log(this.element.dataset.room_id)
    // 目前編輯器語言
    this.panelTarget.className += " ruby"
    // Wrap highlighting function to show line numbers.
    const jar = CodeJar(
      this.panelTarget,
      withLineNumbers(hljs.highlightElement)
    )
    const str = `puts 123`
    jar.updateCode(str)
  }

  run() {
    const language = document.getElementById("current_language").textContent
    const roomID = this.element.dataset.room_id
    const uuid = document.getElementById("web-console").dataset.roomuuid
    const jar = CodeJar(this.panelTarget, hljs.highlightElement)
    const strArray = jar
      .toString()
    const data = {
      code: strArray,
      language: language,
      uuid: uuid
    }
    Rails.ajax({
      url: `/api/v1/rooms/${roomID}/run`,
      type: "post",
      data: new URLSearchParams(data).toString(),
      success: ({ result }) => {
        console.log(result)
        document.getElementById("run_result").textContent=result
      },
      error: (err) => {
        console.log(err)
      },
    })



  }
}
