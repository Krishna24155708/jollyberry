# 🍓 Jollyberry – Event Management Website

A pastel, happy-go-lucky, fully responsive event discovery and registration website built with **HTML5, CSS3 and vanilla JavaScript** (no frameworks, no build step).

> **Live demo:** https://krishna24155708.github.io/jollyberry/
> **Repository:** https://github.com/Krishna24155708/jollyberry

## Features

**Core requirements**
- Attractive hero section with platform stats and a "Next up" event card
- Featured events and an "Upcoming Events" grid of cards (image, name, date, venue, short description, price)
- Live **search** (title, venue, city, category) and **category filter** chips, plus sorting (date / price / name)
- **Event details modal** with full description, agenda, seat availability and a registration button
- **Registration form** (name, email, phone, event, tickets) with JavaScript validation:
  - Name: min. 3 characters, letters only
  - Email: standard email format
  - Phone: valid 10-digit Indian mobile number (accepts +91 / 0 prefixes)
  - Event: must be selected
  - Inline error messages, valid/invalid styling, focus moves to first error
- Success confirmation with a generated booking ID
- Fully responsive for mobile, tablet and desktop (CSS Grid/Flexbox, hamburger menu on small screens)

**Bonus challenges (all implemented)**
- 🌗 Dark / light mode (remembers choice, respects system preference, no flash on load)
- ⏱ Live countdown timers (hero card and each event's detail modal)
- ✨ Animations: scroll-reveal, animated counters, card hover effects, modal transitions (respects `prefers-reduced-motion`)
- 💾 **Local Storage** registration management: "My Tickets" section, cancel registrations, live seat availability

**Extras:** accessibility (skip link, ARIA labels, focus trap in modal, keyboard support, visible focus), back-to-top button, toast notifications, empty state.

## Project structure

```
jollyberry/
├── index.html        # Page structure and semantic markup
├── css/
│   └── style.css     # Design tokens (CSS variables), layout, themes, responsive rules
├── js/
│   ├── events.js     # Event & category data
│   └── app.js        # Rendering, search/filter, modal, validation, localStorage, theme
└── README.md
```

## How it works

- **Data:** `js/events.js` holds the event list. Dates are defined as `daysFromNow`, so events always remain "upcoming" and countdowns always work.
- **Rendering:** `app.js` builds cards from the data with template strings; filtering and sorting are pure functions over the list, re-rendered on every input.
- **Validation:** each field has a validator function returning an error message; fields validate on blur and re-validate on input once invalid; submit validates everything.
- **Persistence:** registrations are saved as JSON under `jollyberry-registrations` in Local Storage; seat availability is computed from them. The theme is stored under `jollyberry-theme`.
- **Theming:** CSS custom properties switched via `data-theme` on `<html>`.

## Run locally

No installation needed. Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
# or
python3 -m http.server 8000
```

## Deployment

**GitHub Pages:** push the repo → *Settings → Pages* → Source: `main` branch, `/ (root)` → save.

**Netlify:** drag-and-drop the folder at app.netlify.com/drop, or connect the GitHub repo (no build command, publish directory `.`).

**Vercel:** import the GitHub repo, framework preset *Other*, no build command, output directory `.`.

## Git workflow

```bash
git init
git add .
git commit -m "feat: initial Jollyberry event website"
git branch -M main
git remote add origin https://github.com/<your-username>/jollyberry.git
git push -u origin main
```

## Tech stack

HTML5 · CSS3 (Grid, Flexbox, custom properties) · JavaScript (ES6+) · Local Storage API · Google Fonts · Unsplash images

## Possible improvements

Backend/API for real bookings, email confirmations, user accounts, calendar (.ics) export, map integration.

## License

MIT – free to use for learning and portfolio purposes.
