import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["map"]

  connect() {
    this.render()
  }

  render() {
    if (!this.hasMapTarget) return

    const activeDots = new Set([
      45, 46, 85, 86, 87, 125, 126, 127, 128,
      165, 166, 167, 205, 206, 207, 247,
      290, 291, 292, 330, 331, 332, 333,
      335, 336, 375, 376, 377,
      370, 371, 410, 411, 412, 450, 451,
      378, 379, 380, 418, 419, 420, 421,
      382, 383, 422, 423, 462, 463,
      505, 506, 545, 546,
    ])

    const hubDot = 127

    let html = '<div class="map-dots">'
    for (let i = 0; i < 800; i++) {
      const isHub = i === hubDot
      const isActive = activeDots.has(i)
      html += `<div class="map-dot${isActive ? " active" : ""}${isHub ? " hub" : ""}"></div>`
    }
    html += "</div>"
    this.mapTarget.innerHTML = html
  }
}
