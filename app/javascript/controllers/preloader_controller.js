import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    setTimeout(() => {
      this.element.classList.add("done")
      document.getElementById("game-hud")?.classList.add("visible")
      this.dispatch("done")
      window.dispatchEvent(new CustomEvent("achievement:unlock", { detail: { id: "firstVisit" } }))
    }, 1500)
  }
}
