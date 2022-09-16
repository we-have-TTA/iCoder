import consumer from "./consumer"

consumer.subscriptions.create("RoomChannel", {
  connected() {
    console.log("connect to RoomChannel")
  },

  received({ sessionID, type, body }) {
    if (sessionStorage["sessionID"] === sessionID) {
      return
    }

    if (type === "message") {
      const { content, name, time } = body
      const msg = document.querySelector("#msg")
      const message = `<div class="message">${name} says: ${content} -- ${time}</div>`
      msg.insertAdjacentHTML("afterbegin", message)
    }
  },
})
