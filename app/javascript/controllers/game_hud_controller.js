import { Controller } from "@hotwired/stimulus"
import { getConvexClient } from "../convex_client"

export default class extends Controller {
  static targets = ["xpFill", "xpLevel", "streakCount"]

  connect() {
    this.xp = 0
    this.level = 1
    this.xpToNext = 100
    this.streak = 1
    this.userId = this.getOrCreateUserId()

    // Load streak from localStorage as fallback
    this.loadStreak()

    // Listen for XP events
    this.boundHandleXpAward = this.handleXpAward.bind(this)
    window.addEventListener("xp:award", this.boundHandleXpAward)

    // Try Convex subscription
    this.client = getConvexClient()
    if (this.client) {
      this.subscribeToProfile()
    }
  }

  disconnect() {
    window.removeEventListener("xp:award", this.boundHandleXpAward)
    if (this.unsubscribe) this.unsubscribe()
  }

  getOrCreateUserId() {
    let id = localStorage.getItem("ruby_user_id")
    if (!id) {
      id = "anon_" + Math.random().toString(36).slice(2, 11)
      localStorage.setItem("ruby_user_id", id)
    }
    return id
  }

  loadStreak() {
    const lastVisit = localStorage.getItem("ruby_last_visit")
    const streak = parseInt(localStorage.getItem("ruby_streak") || "0")
    const today = new Date().toDateString()

    if (lastVisit === today) {
      this.streak = Math.max(streak, 1)
    } else {
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      this.streak = lastVisit === yesterday ? streak + 1 : 1
    }

    localStorage.setItem("ruby_last_visit", today)
    localStorage.setItem("ruby_streak", String(this.streak))
    if (this.hasStreakCountTarget) {
      this.streakCountTarget.textContent = this.streak
    }
  }

  async subscribeToProfile() {
    try {
      const { api } = await import("../../convex/_generated/api")
      await this.client.mutation(api.users.ensureProfile, { userId: this.userId })

      this.unsubscribe = this.client.onUpdate(
        api.users.getProfile,
        { userId: this.userId },
        (profile) => {
          if (profile) {
            this.xp = profile.xp
            this.level = profile.level
            this.streak = profile.streak
            this.renderHUD()
          }
        }
      )
    } catch (e) {
      console.warn("Convex profile subscription failed, using local state:", e)
    }
  }

  handleXpAward(event) {
    const { amount, x, y } = event.detail || {}
    this.xp += amount || 0

    if (this.xp >= this.level * this.xpToNext) {
      this.level += 1
    }

    this.renderHUD()

    // Persist to Convex
    if (this.client) {
      import("../../convex/_generated/api").then(({ api }) => {
        this.client.mutation(api.users.addXP, { userId: this.userId, amount: amount || 0 })
      }).catch(() => {})
    }

    // Float popup
    if (x !== undefined && y !== undefined) {
      this.showXpPopup(amount, x, y)
    }
  }

  renderHUD() {
    if (this.hasXpFillTarget) {
      const percent = ((this.xp % this.xpToNext) / this.xpToNext) * 100
      this.xpFillTarget.style.width = percent + "%"
    }
    if (this.hasXpLevelTarget) {
      this.xpLevelTarget.textContent = "Lv " + this.level
    }
    if (this.hasStreakCountTarget) {
      this.streakCountTarget.textContent = this.streak
    }
  }

  showXpPopup(amount, x, y) {
    const popup = document.createElement("div")
    popup.className = "xp-popup"
    popup.textContent = "+" + amount + " XP"
    popup.style.left = x + "px"
    popup.style.top = y + "px"
    document.body.appendChild(popup)
    setTimeout(() => popup.remove(), 1500)
  }
}
