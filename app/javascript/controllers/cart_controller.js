import { Controller } from "@hotwired/stimulus"
import { getConvexClient } from "../convex_client"

export default class extends Controller {
  static targets = ["count"]

  connect() {
    this.items = []
    this.client = getConvexClient()
    this.userId = localStorage.getItem("ruby_user_id")

    this.boundHandleAdd = this.handleAdd.bind(this)
    window.addEventListener("cart:add", this.boundHandleAdd)
  }

  disconnect() {
    window.removeEventListener("cart:add", this.boundHandleAdd)
  }

  handleAdd(event) {
    const { name, price } = event.detail || {}
    if (!name) return

    this.items.push({ name, price })
    this.renderCount()

    // Award XP
    window.dispatchEvent(
      new CustomEvent("xp:award", {
        detail: { amount: 15, x: window.innerWidth / 2, y: window.innerHeight / 2 },
      })
    )

    // First cart achievement
    if (this.items.length === 1) {
      window.dispatchEvent(
        new CustomEvent("achievement:unlock", { detail: { id: "firstCart" } })
      )
    }

    // Persist to Convex
    if (this.client && this.userId) {
      import("../../convex/_generated/api")
        .then(({ api }) => {
          this.client.mutation(api.users.addToCart, {
            userId: this.userId,
            item: { name, price },
          })
        })
        .catch(() => {})
    }
  }

  addItem(event) {
    const name = event.currentTarget.dataset.name || event.params?.name
    const price = parseInt(event.currentTarget.dataset.price || event.params?.price)
    if (name && price) {
      window.dispatchEvent(new CustomEvent("cart:add", { detail: { name, price } }))
    }
  }

  open() {
    if (this.items.length === 0) {
      alert("Your cart is empty. Add some bagels!")
    } else {
      const total = this.items.reduce((sum, item) => sum + item.price, 0)
      const summary = this.items.map((i) => `${i.name} — $${i.price}`).join("\n")
      alert(
        `\u{1F6D2} Cart (${this.items.length} items)\n\n${summary}\n\nTotal: $${total}\n\n\u2192 Connect Convex + payment to enable checkout`
      )
    }
  }

  renderCount() {
    if (this.hasCountTarget) {
      this.countTarget.textContent = this.items.length
      this.countTarget.classList.toggle("has-items", this.items.length > 0)
    }
  }
}
