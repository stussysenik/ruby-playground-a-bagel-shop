# Ruby Bagel Shop (Rails + Stimulus)

[![CI](https://github.com/stussysenik/ruby-playground-a-bagel-shop/actions/workflows/ci.yml/badge.svg)](https://github.com/stussysenik/ruby-playground-a-bagel-shop/actions/workflows/ci.yml)
[![Ruby](https://img.shields.io/badge/Ruby-4.0.1-CC342D?logo=ruby&logoColor=white)](https://www.ruby-lang.org/)
[![Rails](https://img.shields.io/badge/Rails-8.1.2-D30001?logo=rubyonrails&logoColor=white)](https://rubyonrails.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.2.1-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Stimulus](https://img.shields.io/badge/Stimulus-3.2.2-77E8B9)](https://stimulus.hotwired.dev/)

A premium single-page Rails experience for a fictional high-end bagel brand, built with Stimulus controllers, CSS-driven visual design, and Convex-ready live data integration points.

## Status

- Latest local commit: `d318073`
- Runtime health: `bin/rails zeitwerk:check` passes
- Test status: `bin/rails test` passes (currently no assertions authored yet)
- Delivery tracking: see [progress.md](./progress.md)

## Quick Start

```bash
bundle install
npm install
bin/rails db:prepare
bin/dev
```

If you only need Rails server:

```bash
bin/rails server
```

## Documentation

- Docs hub: [docs/README.md](./docs/README.md)
- Progress log: [progress.md](./progress.md)
- CI workflow: [.github/workflows/ci.yml](./.github/workflows/ci.yml)

## Screenshot Preview

![Full Page](./docs/screenshots/full-page.png)

More screenshots are organized in [docs/README.md](./docs/README.md#screenshots).
