import { Controller } from "@hotwired/stimulus"

// Counter targets are animated by the reveal controller when they become visible.
// This controller is a no-op placeholder for Stimulus target registration.
export default class extends Controller {
  static targets = ["counter"]
}
