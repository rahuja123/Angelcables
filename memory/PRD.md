# Angel Cables Website - PRD

## Problem Statement
Improve the website for Angel Cables (angelcables.com) — a wire and cables company based in Delhi (R K Enterprises). Make it competitive with industry leaders like Finolex and Polycab.

## Architecture
- **Frontend**: React + Tailwind CSS + Framer Motion
- **Backend**: FastAPI + MongoDB
- **Design**: Industrial Swiss aesthetic (Slate Navy #0F172A + Industrial Orange #EA580C)
- **Typography**: Chivo (headings), Manrope (body), JetBrains Mono (specs/labels)

## User Personas
- Electrical contractors seeking bulk cable supply
- Builders/developers for residential and commercial projects
- Industrial buyers for factory/infrastructure setups
- Retail customers for home wiring needs

## Core Requirements
- [x] Home page with hero, stats, categories, featured products, why choose us, CTA
- [x] Products page with sidebar category filtering, search, product detail modals
- [x] About Us page with company story, values, timeline, capabilities
- [x] Contact Us page with form, contact info, Google Maps, WhatsApp
- [x] Floating WhatsApp chat button on all pages
- [x] Responsive design (mobile + desktop)
- [x] Sticky navigation with glassmorphism effect
- [x] Backend API with seeded products (12 products, 6 categories)
- [x] Contact form saves enquiries to MongoDB

## What's Been Implemented (Feb 18, 2026)
- Full professional website redesign with industrial Swiss aesthetic
- 4 pages: Home, Products, About Us, Contact Us
- Backend API: /api/products, /api/products/categories, /api/contact, /api/company
- 12 products seeded across 6 categories using original angelcables.com images
- Product filtering by category and search
- Product detail modal with specs, features, WhatsApp enquiry
- Contact form with MongoDB storage
- Responsive navbar with mobile hamburger menu
- Floating WhatsApp button
- Professional footer with CTA strip
- All tests passed (100% backend + frontend)

## Backlog
### P0 (High Priority)
- Admin panel for product management (add/edit/delete products)
- SEO meta tags and Open Graph for all pages

### P1 (Medium Priority)
- Product image gallery (multiple images per product)
- Downloadable product catalog PDF
- Google Analytics integration
- Blog/News section for industry updates

### P2 (Lower Priority)
- Customer testimonials section
- Live chat integration
- Multi-language support (Hindi)
- Performance optimization (lazy loading, image CDN)

## Next Tasks
- Add admin panel for product CRUD operations
- Implement SEO meta tags for better search ranking
- Add product PDF catalog download feature
