import { Controller } from "@hotwired/stimulus"
import { CodeJar } from "codejar"
import hljs from "highlight.js"
// Import line numbers helper.
import { withLineNumbers } from "codejar/linenumbers"
// Connects to data-controller="editor"
export default class extends Controller {
  static targets = ["panel", "run", "draw"]
  connect() {
    this.panelTarget.className += " js"
    // Wrap highlighting function to show line numbers.
    const jar = CodeJar(
      this.panelTarget,
      withLineNumbers(hljs.highlightElement)
    )
    const str = `console.log("Hello, World!!")`
    jar.updateCode(str)
  }

  run() {
    const jar = CodeJar(this.panelTarget, hljs.highlightElement)
    const webConsole = document.querySelector("#web-console")
    const strArray = jar
      .toString()
      .split("\n")
      .filter((e) => e && e !== " ")
      .map((line) => `<p>${line}</p>`)
      .join("")
    webConsole.firstElementChild.textContent = ""
    webConsole.firstElementChild.insertAdjacentHTML("afterbegin", strArray)
  }
}
