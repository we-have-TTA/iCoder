import { Controller } from "stimulus"
import consumer from "../channels/consumer"
import { v4 as uuidv4 } from "uuid"

export default class extends Controller {
  static targets = ["input","button"]

  getSessionID() {
    return (localStorage["sessionID"] ||= uuidv4())
  }

  _cableConnected() {
    // Called when the subscription is ready for use on the server
    // can add welcome msg like 'user_xx is join the room!'
  }

  _cableDisconnected() {
    // Called when the subscription has been terminated by the server
    // can add leave msg otherwise
  }

  _cableReceived({ content, created_at, username }) {
    // Called when there's incoming data on the websocket for this channel
    this.inputTarget.focus()
    const time = created_at.match(/T(?<time>.+)\./).groups.time
    const message = `<div class="flex justify-between"><div>${username}：<span class="message bg-white rounded-full px-1.5 mt-1"> ${content}</span></div><div class="flex items-end">${time}</div></div>`
    document.querySelector("#msg").insertAdjacentHTML("beforeend", message)
    this.inputTarget.value = ""
    document.querySelector("#msg_scroll").scrollTop=document.querySelector("#msg_scroll").scrollHeight
  }

  getRoomUUID() {
    return document.location.pathname.replace("/", "")
  }

  connect() {
    this.channel = consumer.subscriptions.create(
      {
        channel: "RoomChatChannel",
        uuid: this.getRoomUUID(),
        sessionID: this.getSessionID(),
      },
      {
        connected: this._cableConnected.bind(this),
        disconnected: this._cableDisconnected.bind(this),
        received: this._cableReceived.bind(this),
      }
    )
  }

  readName() {
    this.addUserNameToForm()
    this.addUUIDToForm()
    this.element.submit()
  }

  addUUIDToForm() {
    const field = document.createElement("input")
    field.setAttribute("type", "hidden")
    field.setAttribute("name", "uuid")
    field.setAttribute("value", this.getRoomUUID())
    this.element.appendChild(field)
  }

  addUserNameToForm() {
    const field = document.createElement("input")
    field.setAttribute("type", "hidden")
    field.setAttribute("name", "message[username]")
    const name = localStorage["username"]
    if (name) {
      field.setAttribute("value", name)
    } else {
      return
    }
    this.element.appendChild(field)
  }
}