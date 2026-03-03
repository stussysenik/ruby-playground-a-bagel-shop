# Documentation

## Overview

Ruby Bagel Shop is a Rails 8.1 app with a cinematic, section-driven landing page.
The front-end interaction model is Stimulus-first and progressively enhanced.

## Architecture Snapshot

- `app/views/pages/landing.html.erb`: section composition and render order.
- `app/views/shared/*`: isolated section partials (hero, origin, menu, drop, global, testimonials, passport, finale).
- `app/javascript/controllers/*`: UI behavior, animation triggers, counters, cart, and gamification logic.
- `app/assets/stylesheets/components/*`: modular visual system split by concern.
- `convex/*`: optional real-time data integration layer.

## Operational Commands

```bash
bin/rails zeitwerk:check
bin/rails test
bin/dev
```

## Screenshots

### Full Experience

![Full Page](./screenshots/full-page.png)

### Hero

![Hero](./screenshots/hero-section.png)

### Origin

![Origin](./screenshots/origin-section.png)

### Numbers

![Numbers](./screenshots/numbers-section.png)

### Menu

![Menu](./screenshots/menu-section.png)

### Menu Cards Detail

![Menu Cards](./screenshots/menu-cards.png)

### Drop

![Drop Section](./screenshots/drop-section.png)

### Drop Remaining

![Drop Remaining](./screenshots/drop-remaining.png)

### Testimonials

![Testimonials](./screenshots/testimonials-section.png)

### Passport

![Passport](./screenshots/passport-section.png)

### Finale

![Finale](./screenshots/finale-section.png)

## Roadmap Link

See [../progress.md](../progress.md) for completed milestones and upcoming work.
