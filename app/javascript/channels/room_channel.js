import consumer from "./consumer"

consumer.subscriptions.create("RoomChannel", {
  connected() {
    console.log("im connected")
  },

  disconnected() {},

  received({ content, name }) {
    const msg = document.querySelector("#msg")
    msg.innerHTML += `<div class="message">${name} says: ${content}</div>`
  },
})
