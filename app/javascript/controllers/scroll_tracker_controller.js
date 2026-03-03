import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["bakeFill"]

  connect() {
    this.ticking = false
    this.onScroll = this.onScroll.bind(this)
    window.addEventListener("scroll", this.onScroll, { passive: true })
  }

  disconnect() {
    window.removeEventListener("scroll", this.onScroll)
  }

  onScroll() {
    if (!this.ticking) {
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        const percent = Math.round((scrollTop / docHeight) * 100)

        if (this.hasBakeFillTarget) {
          this.bakeFillTarget.style.width = percent + "%"
        }

        if (percent >= 50) {
          window.dispatchEvent(new CustomEvent("achievement:unlock", { detail: { id: "halfBaked" } }))
        }
        if (percent >= 98) {
          window.dispatchEvent(new CustomEvent("achievement:unlock", { detail: { id: "fullyBaked" } }))
        }

        this.ticking = false
      })
      this.ticking = true
    }
  }
}
