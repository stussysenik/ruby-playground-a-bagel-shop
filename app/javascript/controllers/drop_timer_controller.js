import { Controller } from "@hotwired/stimulus"
import { getConvexClient } from "../convex_client"

export default class extends Controller {
  static targets = ["hours", "minutes", "seconds", "remainingCount", "remainingFill"]

  connect() {
    this.dropTime = new Date()
    this.dropTime.setHours(this.dropTime.getHours() + 6, 0, 0, 0)
    this.remaining = 47
    this.totalStock = 200

    this.updateTimer()
    this.timerInterval = setInterval(() => this.updateTimer(), 1000)

    // Try Convex subscription for real-time stock
    this.client = getConvexClient()
    if (this.client) {
      this.subscribeToDrop()
    } else {
      // Fallback: slowly drain locally
      this.drainInterval = setInterval(() => {
        if (this.remaining > 12) {
          this.remaining--
          this.renderRemaining()
        }
      }, 15000)
    }
  }

  disconnect() {
    clearInterval(this.timerInterval)
    clearInterval(this.drainInterval)
    if (this.unsubscribe) this.unsubscribe()
  }

  async subscribeToDrop() {
    try {
      const { api } = await import("../../convex/_generated/api")
      this.unsubscribe = this.client.onUpdate(
        api.drops.getActiveDrop,
        {},
        (drop) => {
          if (drop) {
            this.remaining = drop.remainingStock
            this.totalStock = drop.totalStock
            this.dropTime = new Date(drop.dropTime)
            this.renderRemaining()
          }
        }
      )
    } catch (e) {
      console.warn("Convex drop subscription failed:", e)
    }
  }

  updateTimer() {
    const diff = this.dropTime - new Date()
    if (diff <= 0) return

    const h = Math.floor(diff / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    const s = Math.floor((diff % 60000) / 1000)

    if (this.hasHoursTarget) this.hoursTarget.textContent = String(h).padStart(2, "0")
    if (this.hasMinutesTarget) this.minutesTarget.textContent = String(m).padStart(2, "0")
    if (this.hasSecondsTarget) this.secondsTarget.textContent = String(s).padStart(2, "0")
  }

  renderRemaining() {
    if (this.hasRemainingCountTarget) {
      this.remainingCountTarget.textContent = this.remaining
    }
    if (this.hasRemainingFillTarget) {
      this.remainingFillTarget.style.width = ((this.remaining / this.totalStock) * 100) + "%"
    }
  }
}
