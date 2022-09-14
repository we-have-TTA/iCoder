import consumer from "./consumer"

consumer.subscriptions.create("RoomChannel", {
  connected() {
    console.log("im connected")
  },

  disconnected() {},

  received({ content, name, time }) {
    const msg = document.querySelector("#msg")
    const message = `<div class="message">${name} says: ${content} -- ${time}</div>`
    msg.insertAdjacentHTML("afterbegin", message)
  },
})
