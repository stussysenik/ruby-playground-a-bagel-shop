import { Controller } from "@hotwired/stimulus"
import { getConvexClient } from "../convex_client"

export default class extends Controller {
  static targets = ["grid", "unlockHint"]

  // Fallback menu data when Convex is unavailable
  static menuItems = [
    { itemId: "classic", label: "Signature", name: "The Classic", desc: "Plain perfection. 36-hour ferment, cherry-wood fired. The one that started it all.", price: 6, locked: false, unlockThreshold: 0, bagelStyle: "", emoji: "\u{1FAD3}" },
    { itemId: "everything", label: "Bestseller", name: "The Everything", desc: "Sesame, poppy, garlic, onion, salt. Hand-applied. Architecturally distributed.", price: 7, locked: false, unlockThreshold: 0, bagelStyle: "", emoji: "\u{1F36A}" },
    { itemId: "sesame", label: "Cult Favorite", name: "Sesame Gold", desc: "Toasted black & white sesame. Finished with Maldon salt and aged miso butter.", price: 8, locked: false, unlockThreshold: 0, bagelStyle: "background: radial-gradient(circle at 40% 35%, #f0d88a 0%, #dbb668 20%, #c8a257 45%, #a07830 70%, #7a5a20 100%);", emoji: "\u{1F95E}" },
    { itemId: "zaatar", label: "Secret Menu", name: "Za'atar Sunrise", desc: "Wild thyme za'atar blend, sumac-pickled onion, labneh schmear. Mediterranean dawn.", price: 9, locked: true, unlockThreshold: 4, bagelStyle: "background: radial-gradient(circle at 40% 35%, #e8d5a8 0%, #b8943a 20%, #6b7a3a 45%, #4a5a28 70%, #3a4520 100%);", emoji: "\u2600" },
    { itemId: "truffle", label: "Secret Menu", name: "Black Truffle", desc: "Shaved Périgord truffle. Gruyère. Truffle honey. The $22 bagel people fly for.", price: 22, locked: true, unlockThreshold: 4, bagelStyle: "background: radial-gradient(circle at 40% 35%, #d4c4a8 0%, #8a7a6a 20%, #4a4040 45%, #2a2020 70%, #1a1010 100%);", emoji: "\u{1F48E}" },
    { itemId: "matcha", label: "Secret Menu", name: "Matcha Ceremony", desc: "Ceremonial-grade Uji matcha dough. White chocolate. Yuzu cream cheese. Transcendent.", price: 14, locked: true, unlockThreshold: 6, bagelStyle: "background: radial-gradient(circle at 40% 35%, #d5e8c0 0%, #9ab86a 20%, #6a8a3a 45%, #4a6a28 70%, #3a5020 100%);", emoji: "\u{1F375}" },
  ]

  connect() {
    this.items = this.constructor.menuItems
    this.sectionsVisited = 0
    this.render()

    this.boundHandleSectionVisit = this.handleSectionVisit.bind(this)
    window.addEventListener("section:visited", this.boundHandleSectionVisit)

    // Try Convex subscription
    this.client = getConvexClient()
    if (this.client) {
      this.subscribeToMenu()
    }
  }

  disconnect() {
    window.removeEventListener("section:visited", this.boundHandleSectionVisit)
    if (this.unsubscribe) this.unsubscribe()
  }

  async subscribeToMenu() {
    try {
      const { api } = await import("../../convex/_generated/api")
      this.unsubscribe = this.client.onUpdate(
        api.menuItems.list,
        {},
        (items) => {
          if (items && items.length > 0) {
            this.items = items
            this.render()
          }
        }
      )
    } catch (e) {
      console.warn("Convex menu subscription failed, using local data:", e)
    }
  }

  handleSectionVisit() {
    this.sectionsVisited++

    if (this.sectionsVisited >= 4) {
      if (this.hasUnlockHintTarget) {
        this.unlockHintTarget.innerHTML = "\u{1F513} Secret menu unlocked!"
      }
      window.dispatchEvent(new CustomEvent("achievement:unlock", { detail: { id: "secretMenu" } }))
    }

    this.render()
  }

  render() {
    if (!this.hasGridTarget) return

    this.gridTarget.innerHTML = this.items
      .map((item, i) => {
        const isLocked = item.locked && this.sectionsVisited < item.unlockThreshold
        return `
          <div class="menu-card ${isLocked ? "locked" : ""}" data-id="${item.itemId}">
            ${
              isLocked
                ? `<div class="lock-overlay">
                    <div class="lock-icon">\u{1F512}</div>
                    <div class="lock-text">Keep scrolling to unlock</div>
                  </div>`
                : ""
            }
            <div class="menu-card-bagel">
              <div class="css-bagel bagel-sm" ${item.bagelStyle ? `style="${item.bagelStyle}"` : ""}></div>
            </div>
            <div class="menu-card-label">${item.label}</div>
            <div class="menu-card-name">${item.name}</div>
            <div class="menu-card-desc">${item.desc}</div>
            <div class="menu-card-footer">
              <div class="menu-price">$${item.price}</div>
              ${
                !isLocked
                  ? `<button class="menu-add-btn" data-action="click->menu#addToCart" data-name="${item.name}" data-price="${item.price}">Add +</button>`
                  : ""
              }
            </div>
          </div>
        `
      })
      .join("")
  }

  addToCart(event) {
    event.stopPropagation()
    const name = event.currentTarget.dataset.name
    const price = parseInt(event.currentTarget.dataset.price)
    window.dispatchEvent(
      new CustomEvent("cart:add", { detail: { name, price } })
    )
  }
}
