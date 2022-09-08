import consumer from "./consumer"

consumer.subscriptions.create("RoomChannel", {
  connected() {
  },

  disconnected() {
  },

  received(data) {
    const msg = document.querySelector('#msg')
    msg.innerHTML += `<div class="message"> ${data.content}</div>`
  }
});
