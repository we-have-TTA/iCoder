import { Controller } from "stimulus"

export default class extends Controller {

  connect() {
    let duration_Time = 1
    setInterval(()=> {
      duration_Time += 1
      let sec = String(parseInt(duration_Time % 60)).padStart(2,'0')
      let min = String(parseInt((duration_Time / 60) % 60)).padStart(2,'0')
      let hr = String(parseInt(duration_Time / 60 / 60)).padStart(2,'0')
      document.getElementById("timer").textContent = `${hr}:${min}:${sec}`
    }, 1000);
    
  }
}
