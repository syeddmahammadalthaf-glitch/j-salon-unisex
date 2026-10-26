# J Salon Unisex — Luxury Salon & Spa Management Web Application

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-Semantic%20Markup-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-Modern%20Design%20System-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

A full-featured client booking and salon management web application engineered for **J Salon Unisex**, a premier 4.8★ rated salon located on Court Road beside Max Mall, Anantapur. The platform delivers an end-to-end luxury customer booking journey, real-time pricing calculator, WhatsApp booking confirmation dispatch, and a comprehensive administrative portal (`admin.html`) for back-office appointment oversight.

---

## ✂️ Overview & Problem Solved

Managing high client volume across haircare, skin treatments, keratin smoothing, and bridal makeovers requires an error-free scheduling system that prevents double-booking while giving customers a transparent pricing and service preview.

This project delivers:
1. **A friction-free client portal:** Clear service menus with duration and price breakdown, stylist selection, slot availability, and instant WhatsApp booking integration.
2. **An administrative portal (`admin.html`):** Back-office oversight for salon managers to review incoming bookings, filter by date, verify client phone numbers, and update appointment statuses.

---

## ✨ Core Application Features

- **Categorized Luxury Menu:** Intuitive tabbed browsing covering Haircuts & Styling, Kérastase Hair Spa, Balayage & Coloring, HydraFacials, and Bridal Packages.
- **Dynamic Price & Duration Calculator:** Interactive service multi-selection dynamically tallies total estimated time and pricing before checkout.
- **WhatsApp Direct Dispatch:** Integrates WhatsApp API intent linking so confirmed appointments are automatically formatted with service details, date, time, and client details, routed directly to the salon reception desk.
- **Back-Office Management Dashboard (`admin.html` & `admin.js`):**
  - Live appointment queue with status indicators (Confirmed, Pending, Completed).
  - Search and filter controls by client name, date range, or service category.
  - Appointment cancellation and confirmation toggles.
- **Responsive Mobile Experience:** Fluid layout optimized for iOS Safari and Android Chrome, featuring sticky booking actions and tap-friendly touch targets.
- **SEO & Local Business Rich Snippets:** Embedded Schema.org `BeautySalon` structured data with verified geo-location coordinates, operating schedule, and price range.

---

## 🛠️ Technology Stack

| Component | Technologies |
|---|---|
| **Frontend Foundation** | HTML5 Semantic Elements, Accessible ARIA Attributes |
| **Styling & Theming** | CSS3, CSS Custom Variables, Modern Flexbox & Grid, Glassmorphic Modals |
| **Client-Side Logic** | JavaScript (ES6+), Event Delegation, LocalStorage State Management |
| **Integration** | WhatsApp Web / Mobile Click-to-Chat API |
| **Deployment** | Vercel Edge Hosting (`vercel.json`) |

---

## 📂 Project Structure

```
j-salon-unisex/
├── index.html         # Client-facing landing page, service catalogue & booking workflow
├── app.js             # Client booking controller, price calculation, validation & WhatsApp dispatch
├── styles.css         # Complete salon theme, luxury dark palette, responsive media queries
├── admin.html         # Back-office appointment management dashboard
├── admin.js           # Administrative control logic, appointment table filters & status toggles
├── vercel.json        # Vercel deployment configuration
├── assets/            # Salon imagery, brand logo, service thumbnails, and icons
├── .gitignore         # File exclusions for Git
├── LICENSE            # MIT License
└── README.md          # Comprehensive documentation
```

---

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/syeddmahammadalthaf-glitch/j-salon-unisex.git
   cd j-salon-unisex
   ```

2. **Serve locally:**
   Run any static web server:
   ```bash
   # Using Python 3
   python -m http.server 3000

   # Or npx serve
   npx serve .
   ```

3. **Open:**
   - Client Booking Portal: `http://localhost:3000`
   - Administrative Dashboard: `http://localhost:3000/admin.html`

---

## 💡 Architectural Decisions

- **Client-Side Autonomy:** Built with zero server overhead by taking advantage of client-side local storage and WhatsApp intent URLs, eliminating database server maintenance costs while ensuring immediate booking delivery to salon staff.
- **Modular JavaScript Architecture:** Cleanly segregated customer-facing logic (`app.js`) from administrative management logic (`admin.js`), ensuring separation of concerns and preventing unauthorized access to admin controllers from the public storefront.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
