# Personal Portfolio Website

A personal portfolio website developed as part of an Information Technology course project. It presents a professional profile, showcases projects, integrates multiple external APIs, and implements transaction-based features — all built with vanilla HTML, CSS, and JavaScript.

---

# Project Overview

This portfolio serves as a digital resume and project showcase for an IT student. It demonstrates frontend development skills including responsive layout design, JavaScript interactivity, external API consumption, and form-based transaction handling. The site features dynamic content rendering, animated UI elements, and a clean, dark-themed professional design.

---

# File Structure

```
portfolio/
├── index.html          # Main page (Home, About, Skills, Projects, Contact)
├── projects.html       # Full projects listing page
├── project-detail.html # Individual project detail view
├── blog.html           # Blog/articles page powered by Dev.to API
├── script.js           # Main JavaScript (interactions, API calls, form logic)
├── styles.css          # Global stylesheet
├── images/             # Profile photo, project screenshots, icons
└── README.md           # This file
```

---

# API Integrations

### 1. GitHub API
- **Endpoint:** `https://api.github.com/users/{username}`
- **Purpose:** Dynamically fetches and displays the GitHub profile stats (public repositories count, followers) directly on the homepage, keeping the profile data always up to date without manual editing.

### 2. Dev.to API
- **Endpoint:** `https://dev.to/api/articles?tag={tag}&per_page=...`
- **Purpose:** Used in two places — on the homepage (a preview section) and on the dedicated `blog.html` page. Fetches recent tech articles filtered by relevant development tags, presenting external content that aligns with the portfolio owner's tech interests and specializations.

### 3. Leaflet.js + OpenStreetMap (Map/Location API)
- **Library:** Leaflet.js (`https://unpkg.com/leaflet@1.9.4`)
- **Tile Source:** OpenStreetMap
- **Purpose:** Renders an interactive map in the Contact section, displaying the portfolio owner's general location with a custom popup. This provides visitors with a visual geographic reference and makes the contact section more engaging.

### 4. Web3Forms API
- **Endpoint:** `https://api.web3forms.com/submit`
- **Purpose:** Handles actual form submission for both the Contact form and the Hire Me inquiry form. Processes the form data and routes messages to the owner's email without requiring a backend server.

### 5. Tidio (Live Chat API)
- **Source:** Tidio Live Chat (`https://code.tidio.co/{public_key}.js`)
- **Purpose:** Integrates a real-time chatbot and live chat widget into the portfolio. Visitors can send messages directly through the Tidio chat bubble that appears on the site, and all incoming messages are received and manageable by the portfolio owner via the Tidio dashboard. This replaces or supplements traditional contact methods by offering an instant, conversational way for recruiters, clients, or collaborators to reach out.

---

# Transaction Features

### Transaction 1 — Contact Form Submission

Located in the **Contact** section of `index.html`.

- **What it does:** Allows visitors to send a message directly to the portfolio owner.
- **Fields:** Name, Email, Subject, Message (with a hidden access key field for Web3Forms).
- **Validation:**
  - All fields are required.
  - Email is validated against a regex pattern and checked against a blocklist of disposable/fake email domains (e.g., `mailinator.com`, `tempmail.com`).
  - Real-time border highlight on invalid email (on blur).
- **Processing:** On submit, form data is sent via `fetch()` as a `FormData` POST request to the Web3Forms API, which delivers the message to the owner's inbox.
- **User Feedback:**
  - ✓ Success: displays a green confirmation message and resets the form.
  - ✗ Error: displays a red error message prompting the user to retry.

### Transaction 2 — Hire Me / Project Inquiry Form

Triggered by the **"Hire Me"** button; opens a modal overlay on `index.html`.

- **What it does:** Lets potential clients submit a formal project inquiry including project type, budget range, and a description.
- **Fields:** Name, Email, Project Type (dropdown), Estimated Budget (dropdown), Project Description.
- **Validation:**
  - Name: required, minimum 2 characters.
  - Email: validated with a regex pattern.
  - Project Type: required selection.
  - Description: required, minimum 10 characters.
  - Inline error messages are shown per field upon failed validation.
- **Processing:** On successful validation, a unique inquiry ID is generated (`INQ-{timestamp}`), and the data is submitted via `fetch()` as a JSON POST to Web3Forms. The submission includes the ID, project type, budget, timestamp (Asia/Manila timezone), and description.
- **User Feedback:**
  - ✅ Success: displays a confirmation with the inquiry ID and expected response time, then auto-closes the modal after 3 seconds.
  - ✗ Error: displays a red error message and re-enables the submit button for retry.

---

# How to Run / View the Project

### Option A — Open Locally

1. Download or clone the project folder.
2. Open `index.html` in any modern web browser (Chrome, Firefox, Edge).
3. No build tools or local server required for basic functionality.

> **Note:** Some browsers may block certain `fetch()` requests when opening files directly from the filesystem (`file://` protocol). If API content does not load, use Option B.

### Option B — Use a Local Server (Recommended)

If you have VS Code, use the **Live Server** extension:
1. Right-click `index.html` → **Open with Live Server**.

Or use Python's built-in server:
```bash
# Python 3
python -m http.server 8080
```
Then open `http://localhost:8080` in your browser.

### Option C — GitHub Pages / Hosting

Upload the project folder to a GitHub repository and enable **GitHub Pages** under Settings → Pages to get a live public URL.

---

# Technologies Used

| Category | Technologies |
|---|---|
| Structure | HTML5 |
| Styling | CSS3 (custom, no framework) |
| Interactivity | Vanilla JavaScript (ES6+) |
| 3D / Canvas | Three.js (cursor particle effect), HTML5 Canvas API |
| Map | Leaflet.js + OpenStreetMap |
| Fonts | Google Fonts (Roboto, Nunito Sans, Lexend, Roboto Mono, etc.) |
| APIs | GitHub API, Dev.to API, Web3Forms API, Tidio Live Chat API |

---

# Key Features

- Animated Three.js purple particle cursor trail
- Hero canvas with animated shooting stars
- Click-burst star animation on every mouse click
- Typing animation cycling through developer roles
- Scroll-reveal animations for sections and cards
- Interactive project preview side panel (hover to peek)
- Infinite auto-scrolling tech stack carousel
- Scroll-driven timeline with progress line and animated dots
- Spotlight glow effect on tool and expertise cards
- Mobile-responsive layout with hamburger navigation
- Dark-themed, consistent color scheme (purple accent)
- Live chat widget powered by Tidio for real-time visitor messaging

---

# Notes

- All APIs must be active and connected to the internet during the demo for live data to appear.
- The Web3Forms access key is embedded in the JavaScript. For production use, consider securing this via a backend proxy.
- Real payment processing is not implemented; the Hire Me form is a project inquiry simulation only.
- Tidio messages are managed through the Tidio dashboard. An active Tidio account is required for the chat widget to function.