import consumer from "./consumer"

consumer.subscriptions.create("RoomChannel", {
  connected() {
    console.log("connect!")
  },

  disconnected() {
  },

  received(data) {
    const msg = document.querySelector('#msg')
    msg.innerHTML += `<div class="message"> ${data.content}</div>`
    document.querySelector("#message_content").value = ""
    console.log(data);
  }
});
