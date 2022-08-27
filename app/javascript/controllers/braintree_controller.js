import { Controller } from "stimulus"
import dropin from "braintree-web-drop-in"
import { Alert } from "bootstrap"

export default class extends Controller {
  static targets = ["payment"]

  connect() {
    console.log(123)
    const { token } = this.element.dataset

    dropin
      .create({
        authorization: token,
        container: this.paymentTarget,
      })
      .then((instance) => {
        this.element.addEventListener("submit", (e) => {
          e.preventDefault()

          instance.requestPaymentMethod().then(({ nonce }) => {
            this.createNonceField(nonce)
            this.element.submit()
          })
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  createNonceField(nonce) {
    const field = document.createElement("input")
    field.setAttribute("type", "hidden")
    field.setAttribute("name", "nonce")
    field.setAttribute("value",nonce)

    this.element.appendChild(field)
  }
}