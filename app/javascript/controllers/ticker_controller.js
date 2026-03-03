import { Controller } from "@hotwired/stimulus"
import { getConvexClient } from "../convex_client"

export default class extends Controller {
  static targets = ["container", "text"]

  static fallbackOrders = [
    { name: "Sarah M.", item: "6 Everything Bagels", loc: "Brooklyn, NY" },
    { name: "Kenji T.", item: "Ruby Red Velvet x2", loc: "Tokyo, JP" },
    { name: "Fatima A.", item: "12 Classic Bagels", loc: "Dubai, UAE" },
    { name: "Lars B.", item: "Truffle Bagel Pack", loc: "Stockholm, SE" },
    { name: "Maria C.", item: "Sesame Gold x4", loc: "São Paulo, BR" },
    { name: "James W.", item: "Everything + Cream Cheese", loc: "London, UK" },
    { name: "Priya S.", item: "Matcha Ceremony x3", loc: "Mumbai, IN" },
    { name: "Chen L.", item: "24 Mixed Bagels", loc: "Shanghai, CN" },
    { name: "Emma R.", item: "Za'atar Sunrise x6", loc: "Paris, FR" },
    { name: "David K.", item: "Full Passport Pack", loc: "Seoul, KR" },
    { name: "Sofia V.", item: "Ruby Red Velvet", loc: "Mexico City, MX" },
    { name: "Olga P.", item: "12 Everything Bagels", loc: "Berlin, DE" },
  ]

  connect() {
    this.index = 0
    this.client = getConvexClient()

    if (this.client) {
      this.subscribeToTicker()
    } else {
      this.startFallbackTicker()
    }
  }

  disconnect() {
    clearInterval(this.tickerInterval)
    clearTimeout(this.firstTimeout)
    if (this.unsubscribe) this.unsubscribe()
  }

  async subscribeToTicker() {
    try {
      const { api } = await import("../../convex/_generated/api")
      this.unsubscribe = this.client.onUpdate(
        api.liveTicker.getLatest,
        {},
        (event) => {
          if (event) {
            this.showOrder(event.customerName, event.item, event.location)
          }
        }
      )
    } catch (e) {
      console.warn("Convex ticker subscription failed, using fallback:", e)
      this.startFallbackTicker()
    }
  }

  startFallbackTicker() {
    this.firstTimeout = setTimeout(() => {
      this.showRandomOrder()
      this.tickerInterval = setInterval(() => this.showRandomOrder(), 8000)
    }, 5000)
  }

  showRandomOrder() {
    const orders = this.constructor.fallbackOrders
    const order = orders[this.index % orders.length]
    this.showOrder(order.name, order.item, order.loc)
    this.index++
  }

  showOrder(name, item, location) {
    if (this.hasTextTarget) {
      this.textTarget.innerHTML = `<strong>${this.escapeHtml(name)}</strong> just ordered ${this.escapeHtml(item)} \u2014 ${this.escapeHtml(location)}`
    }
    if (this.hasContainerTarget) {
      this.containerTarget.classList.add("show")
      setTimeout(() => this.containerTarget.classList.remove("show"), 4000)
    }
  }

  escapeHtml(str) {
    const div = document.createElement("div")
    div.textContent = str
    return div.innerHTML
  }
}
