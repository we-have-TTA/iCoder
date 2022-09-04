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
    const str = `const axios = require('axios').default;

    // Make a request for a user with a given ID
    axios.get('/user?ID=12345')
      .then(function (response) {
        // handle success
        console.log(response);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
    
    // Optionally the request above could also be done as
    axios.get('/user', {
        params: {
          ID: 12345
        }
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
        // always executed
      });  
    
    // Want to use async/await? Add the 'async' keyword to your outer function/method.
    async function getUser() {
      try {
        const response = await axios.get('/user?ID=12345');
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    }`
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
