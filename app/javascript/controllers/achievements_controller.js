import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["toast", "icon", "title", "desc"]

  static definitions = {
    firstVisit:   { icon: "\u{1F44B}", title: "Welcome", desc: "You found Ruby. Nothing will be the same." },
    storyReader:  { icon: "\u{1F4D6}", title: "Story Time", desc: "You read our origin. Respect." },
    menuExplorer: { icon: "\u{1F50D}", title: "Menu Explorer", desc: "You browsed the full collection." },
    secretMenu:   { icon: "\u{1F512}", title: "Secret Unlocked", desc: "You unlocked the secret menu items." },
    dropHunter:   { icon: "\u23F1", title: "Drop Hunter", desc: "You checked the limited edition drop." },
    globetrotter: { icon: "\u{1F30D}", title: "Globetrotter", desc: "You explored our global reach." },
    cultMember:   { icon: "\u{1F48E}", title: "Cult Member", desc: "You're officially one of us." },
    firstCart:    { icon: "\u{1F6D2}", title: "First Cart", desc: "Your first item. The addiction begins." },
    halfBaked:    { icon: "\u{1F525}", title: "Half Baked", desc: "50% scrolled. Keep going." },
    fullyBaked:   { icon: "\u2728", title: "Fully Baked", desc: "100% scrolled. You are now a Ruby expert." },
  }

  connect() {
    this.unlocked = new Set()
    this.queue = []
    this.showing = false

    this.boundHandleUnlock = this.handleUnlock.bind(this)
    window.addEventListener("achievement:unlock", this.boundHandleUnlock)
  }

  disconnect() {
    window.removeEventListener("achievement:unlock", this.boundHandleUnlock)
  }

  handleUnlock(event) {
    const { id } = event.detail || {}
    if (!id || this.unlocked.has(id)) return
    this.unlocked.add(id)

    const def = this.constructor.definitions[id]
    if (!def) return

    this.queue.push(def)
    if (!this.showing) this.showNext()

    // Award XP for achievement
    window.dispatchEvent(
      new CustomEvent("xp:award", {
        detail: { amount: 25, x: window.innerWidth - 200, y: 100 },
      })
    )
  }

  showNext() {
    if (this.queue.length === 0) {
      this.showing = false
      return
    }

    this.showing = true
    const def = this.queue.shift()

    if (this.hasIconTarget) this.iconTarget.textContent = def.icon
    if (this.hasTitleTarget) this.titleTarget.textContent = def.title
    if (this.hasDescTarget) this.descTarget.textContent = def.desc

    if (this.hasToastTarget) {
      this.toastTarget.classList.add("show")
    }

    setTimeout(() => {
      if (this.hasToastTarget) {
        this.toastTarget.classList.remove("show")
      }
      setTimeout(() => this.showNext(), 500)
    }, 3500)
  }
}
