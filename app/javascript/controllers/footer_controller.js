import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["timer"]

  connect() {
    let timerDisplay = this.timerTarget.children[0]
    let duration_Time = 1
    setInterval(()=> {
      duration_Time += 1
      let sec = String(parseInt(duration_Time % 60)).padStart(2,'0')
      let min = String(parseInt((duration_Time / 60) % 60)).padStart(2,'0')
      let hr = String(parseInt(duration_Time / 60 / 60)).padStart(2,'0')
      // target.textContent = `距可刪除\n${hr}:${min}:${sec}`
      // console.log(`距可刪除\n${hr}:${min}:${sec}`)
      timerDisplay.textContent = `${hr}:${min}:${sec}`
      // if ( timerDisplay.textContent == "00:00:10") {
      //   window.alert('十秒了')
      // }
    }, 1000);
    
  }
}
