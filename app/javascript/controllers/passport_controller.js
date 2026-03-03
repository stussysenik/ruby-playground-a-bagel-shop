import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["stampGrid", "count", "fill"]

  static passportItems = [
    { id: "classic", icon: "\u{1FAD3}", name: "Classic" },
    { id: "everything", icon: "\u{1F36A}", name: "Everything" },
    { id: "sesame", icon: "\u{1F95E}", name: "Sesame" },
    { id: "zaatar", icon: "\u2600\uFE0F", name: "Za'atar" },
    { id: "truffle", icon: "\u{1F48E}", name: "Truffle" },
    { id: "matcha", icon: "\u{1F375}", name: "Matcha" },
    { id: "ruby-red", icon: "\u{1F534}", name: "Ruby Red" },
    { id: "mystery", icon: "\u2753", name: "????" },
  ]

  connect() {
    this.stamps = new Set(["classic", "everything", "sesame"])
    this.render()
  }

  render() {
    if (!this.hasStampGridTarget) return

    this.stampGridTarget.innerHTML = this.constructor.passportItems
      .map((item) => {
        const collected = this.stamps.has(item.id)
        return `
          <div class="stamp ${collected ? "collected" : "locked"}">
            <div class="stamp-icon">${item.icon}</div>
            <div class="stamp-name">${item.name}</div>
          </div>
        `
      })
      .join("")

    const count = this.stamps.size
    if (this.hasCountTarget) {
      this.countTarget.textContent = `${count} / 8`
    }
    if (this.hasFillTarget) {
      this.fillTarget.style.width = `${(count / 8) * 100}%`
    }
  }
}
