import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    // Generate seeds on origin bagel
    this.generateSeeds()

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")

            const section = entry.target.closest("section")
            if (section) {
              window.dispatchEvent(
                new CustomEvent("section:visited", {
                  detail: { id: section.id, rect: entry.target.getBoundingClientRect() },
                })
              )
            }

            // Trigger counter animations
            const counters = entry.target.querySelectorAll("[data-counter-target='counter']")
            if (counters.length) {
              counters.forEach((el) => this.animateCounter(el))
            }
          }
        })
      },
      { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
    )

    document.querySelectorAll(".reveal").forEach((el) => this.observer.observe(el))
  }

  disconnect() {
    this.observer?.disconnect()
  }

  generateSeeds() {
    const bagel = document.getElementById("origin-bagel")
    if (!bagel) return
    bagel.querySelectorAll(".seed").forEach((seed) => seed.remove())
    const types = ["seed-sesame", "seed-poppy", "seed-salt"]
    for (let i = 0; i < 40; i++) {
      const seed = document.createElement("div")
      seed.className = "seed " + types[Math.floor(Math.random() * types.length)]
      const angle = (Math.random() * 360) * (Math.PI / 180)
      const radius = 30 + Math.random() * 32
      seed.style.left = `${50 + Math.cos(angle) * radius}%`
      seed.style.top = `${50 + Math.sin(angle) * radius}%`
      seed.style.transform = `rotate(${Math.random() * 360}deg)`
      bagel.appendChild(seed)
    }
  }

  animateCounter(el) {
    if (el.dataset.animated) return
    el.dataset.animated = "true"
    const target = parseInt(el.dataset.targetValue)
    const duration = 2000
    const start = performance.now()

    const update = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      el.textContent = Math.floor(target * eased).toLocaleString()
      if (progress < 1) requestAnimationFrame(update)
      else el.textContent = target.toLocaleString()
    }
    requestAnimationFrame(update)
  }
}
