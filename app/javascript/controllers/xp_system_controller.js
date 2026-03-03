import { Controller } from "@hotwired/stimulus"

// This controller listens for section visits and awards XP.
// It dispatches xp:award events that game_hud_controller picks up.
export default class extends Controller {
  static visitedSections = new Set()

  connect() {
    this.boundHandleSectionVisit = this.handleSectionVisit.bind(this)
    window.addEventListener("section:visited", this.boundHandleSectionVisit)
  }

  disconnect() {
    window.removeEventListener("section:visited", this.boundHandleSectionVisit)
  }

  handleSectionVisit(event) {
    const { id, rect } = event.detail || {}
    if (!id || this.constructor.visitedSections.has(id)) return

    this.constructor.visitedSections.add(id)

    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
    const y = rect ? rect.top : window.innerHeight / 2

    window.dispatchEvent(
      new CustomEvent("xp:award", { detail: { amount: 10, x, y } })
    )

    // Section-specific achievements
    const achievementMap = {
      origin: "storyReader",
      menu: "menuExplorer",
      drop: "dropHunter",
      global: "globetrotter",
      cult: "cultMember",
    }

    if (achievementMap[id]) {
      window.dispatchEvent(
        new CustomEvent("achievement:unlock", { detail: { id: achievementMap[id] } })
      )
    }
  }
}
