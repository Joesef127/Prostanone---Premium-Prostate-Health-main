# Prostanone — Project TODO List

> Tracks outstanding work, bugs, and client requirements.
> Status: ⬜ Not Started | 🔄 In Progress | ✅ Done | ❌ Blocked

---

## Section A — Known Bugs & Broken Features

These are things identified during codebase audit that are currently non-functional.

| # | Status | Task | File | Notes |
|---|---|---|---|---|
| A1 | ⬜ | Implement Contact form submit handler | `pages/Contact.tsx` | Form renders but does nothing on submit. Needs `onSubmit` + integration (formsubmit.co or webhook) |
| A2 | ⬜ | Verify Korapay SDK script tag is in index.html | `index.html` | `window.Korapay` is used in Checkout but the `<script src="...">` loading the SDK may be missing. Add `<script src="https://cdn.korapay.com/charge.min.js"></script>` if absent |
| A3 | ⬜ | Build Privacy Policy page | `pages/` (new file) | Footer links to it but page doesn't exist |
| A4 | ⬜ | Build Terms of Service page | `pages/` (new file) | Footer links to it but page doesn't exist |
| A5 | ⬜ | Build Refund Policy page | `pages/` (new file) | Footer links to it but page doesn't exist |
| A6 | ⬜ | Build Shipping Policy page | `pages/` (new file) | Footer links to it but page doesn't exist |
| A7 | ⬜ | Add real social media links in Footer | `components/Footer.tsx` | Twitter, Facebook, Instagram all point to `#` — replace with real URLs from client |

---

## Section B — Missing Persistence / UX Issues

| # | Status | Task | File | Notes |
|---|---|---|---|---|
| B1 | ⬜ | Persist cart to localStorage | `context/AppContext.tsx` | Currently in-memory only — page refresh empties the cart. Use `localStorage` to save/restore cart |
| B2 | ⬜ | Persist quiz result to sessionStorage | `context/AppContext.tsx` | Refreshing on `/results` redirects user back to `/quiz`. Save result in sessionStorage so it survives a refresh |

---

## Section C — Content & Data Fixes

| # | Status | Task | File | Notes |
|---|---|---|---|---|
| C1 | ⬜ | Confirm/fix NAFDAC Reg No on hero card | `pages/Home.tsx` | Currently shows `A7-1234L` which looks like a placeholder — confirm real number with client |
| C2 | ⬜ | Align contact email across site | `pages/Contact.tsx`, `components/Footer.tsx` | Contact page says `support@holisbotanicals.com`, Footer says `support@prostanone.ng` — pick one and make consistent |
| C3 | ⬜ | Use or remove the `IMAGES` constant | `constants.ts` | Contains unused `picsum.photos` placeholder URLs. Either update with real image paths or delete the constant |
| C4 | ⬜ | Use or remove `public/images/` product photos | `public/images/` | `Prostanone01-04.jpg` exist but are referenced nowhere in code — wire them up (gallery, carousel, etc.) or confirm they're not needed |

---

## Section D — Client Requirements

> Cross-referenced against the official Holis Botanical Gardens requirements document.
> ✅ = already built | ⚠️ = partially built | ⬜ = not started

---

### D — Pages & Structure

| # | Status | Task | Notes |
|---|---|---|---|
| D1 | ✅ | Home Page | Built |
| D2 | ⚠️ | Dedicated Prostanone Product Page | Product info is currently spread across Home, Science, and About. Client requires a standalone `/product` page with images, description, benefits, ingredients, dosage, testimonials, FAQ, and Buy Now CTA all in one place |
| D3 | ✅ | Shop / Order Page | Summary + Checkout covers this |
| D4 | ⬜ | Distributor Application Page (`/distributor`) | Does not exist. Needs full form: Full Name, Phone, Email, State/Location, Business Type, Expected Order Quantity. Form data must POST to webhook or database |
| D5 | ✅ | About Holis Botanical Gardens | Built |
| D6 | ⚠️ | Contact Page — wire up the form | Page exists but submit button does nothing. Needs `onSubmit` handler (already in A1) |
| D7 | ⬜ | Blog / Health Education Section (`/blog`) | Optional per client but recommended. Needs index page + individual article pages. Content likely CMS-driven |
| D8 | ⬜ | Privacy Policy page | Footer link exists, page does not (also in A3) |
| D9 | ⬜ | Shipping Policy page | Footer link exists, page does not (also in A5) |
| D10 | ⬜ | Refund Policy page | Footer link exists, page does not (also in A4) |
| D11 | ⬜ | Terms & Conditions page | Footer link exists, page does not (also in A4) |

---

### D — CMS / Admin Panel

> This is the largest missing piece. Currently there is no admin interface — all content is hardcoded in `constants.ts`.

| # | Status | Task | Notes |
|---|---|---|---|
| D12 | ⬜ | Decide on CMS approach | Options: (a) Headless CMS e.g. Sanity/Contentful, (b) Custom admin panel with a backend, (c) Simple spreadsheet-driven via Google Sheets + n8n. Needs decision before implementing D13–D19 |
| D13 | ⬜ | Admin: edit text content (product descriptions, page copy) | Requires CMS integration |
| D14 | ⬜ | Admin: change product images | Requires CMS + file/image upload capability |
| D15 | ⬜ | Admin: update product prices | Currently hardcoded in `constants.ts` → `PACKAGES`. Must be CMS-editable |
| D16 | ⬜ | Admin: add new products | Architecture must support multiple products (not just Prostanone) |
| D17 | ⬜ | Admin: update delivery fees | Currently hardcoded in `Checkout.tsx` (`finalDeliveryFee` logic). Must be CMS/config-editable |
| D18 | ⬜ | Admin: access customer orders | n8n webhook receives orders. Client needs a proper dashboard or export (Google Sheets, Airtable, or custom) |
| D19 | ⬜ | Admin: access distributor applications | Requires distributor form (D4) + storage + admin view |
| D20 | ⬜ | Admin: access newsletter subscribers | n8n receives signups. Needs proper admin view or export |

---

### D — Order & Delivery System

| # | Status | Task | Notes |
|---|---|---|---|
| D21 | ⚠️ | Customer selects delivery state | State dropdown exists in Checkout Step 2. But only Lagos vs. non-Lagos logic — does not support per-state pricing |
| D22 | ⬜ | Per-state delivery pricing | Client wants delivery options with fixed prices per state/region. Current code only has two tiers (Lagos free, all others ₦3,000). Needs full state-by-state or zone-based delivery fee table |
| D23 | ⬜ | Explicit delivery option selection by customer | Currently fee is calculated automatically. Client wants customers to actively select a delivery option (e.g. Standard / Express) |

---

### D — Payment System

| # | Status | Task | Notes |
|---|---|---|---|
| D24 | ✅ | Korapay payment gateway | Existing and working |
| D25 | ⬜ | Add a second payment gateway alongside Korapay | Client explicitly says "add, do not replace." Common Nigerian options: Paystack, Flutterwave. Customers must be able to choose at checkout |
| D26 | ✅ | Automatic order confirmation email | Handled via formsubmit.co on payment success |
| D27 | ⬜ | Admin access to payment records | Needs dashboard or integration with payment provider's dashboard |

---

### D — WhatsApp Integration

| # | Status | Task | Notes |
|---|---|---|---|
| D28 | ⚠️ | WhatsApp button visible on all pages | Currently hidden on `/checkout` and `/quiz` intentionally. Client wants it on ALL pages — decision needed on whether to show it on those pages too |
| D29 | ⚠️ | Option to complete orders through WhatsApp | Button exists but just opens a blank chat. Should pre-fill a message e.g. "Hi, I'd like to order Prostanone — [package name]" for a proper WhatsApp order flow |

---

### D — Sales Funnel & Lead Capture

| # | Status | Task | Notes |
|---|---|---|---|
| D30 | ✅ | Email capture pop-up (newsletter) | Built in `NewsletterPopup.tsx` |
| D31 | ⬜ | All collected data stored in company-owned database | Currently data goes to n8n webhooks (external). Client requires full ownership — needs a proper database (e.g. Supabase, PlanetScale, or self-hosted Postgres) that Holis controls |
| D32 | ⬜ | Promotional email / discount alerts system | Collecting emails is done; actually sending promotions requires an email marketing platform (Mailchimp, Brevo, etc.) integrated with the subscriber list |

---

### D — Abandoned Cart Recovery

| # | Status | Task | Notes |
|---|---|---|---|
| D33 | ⚠️ | Capture contact info early for abandoned cart | Contact info is sent to n8n at Checkout Step 1 (`contact_info_entered`). The capture is in place |
| D34 | ⬜ | Automated reminder email to abandoned cart customer | n8n receives the data but an actual automated follow-up email flow needs to be configured (n8n automation + email provider) |
| D35 | ⬜ | Optional discount in abandoned cart reminder | Not implemented anywhere. Requires the email flow (D34) + discount code logic |
| D36 | ⬜ | Link in reminder email that resumes the cart | Requires persistent cart (B1) + a resumable cart URL strategy |

---

### D — Distributor Recruitment

| # | Status | Task | Notes |
|---|---|---|---|
| D37 | ⬜ | Distributor application page with full form | Same as D4. Fields: Full Name, Phone, Email, State/Location, Business Type, Expected Order Quantity |
| D38 | ⬜ | Store distributor applications in database | Form submissions must be saved and accessible to admin (D19) |
| D39 | ⬜ | Auto-acknowledgement email to applicant | On form submit, send confirmation email to the applicant |

---

### D — Email System

| # | Status | Task | Notes |
|---|---|---|---|
| D40 | ⬜ | Set up custom email addresses | `info@holisbotanicalgardens.com`, `sales@holisbotanicalgardens.com`, `distributors@holisbotanicalgardens.com`, `support@holisbotanicalgardens.com` — this is a domain/hosting task, not a code task. Needs Google Workspace or Zoho Mail setup |
| D41 | ⬜ | Update all site email references to new addresses | Once D40 is done, update `Contact.tsx`, `Footer.tsx`, `Checkout.tsx` (formsubmit target), and any webhook configs |

---

### D — Performance & Mobile

| # | Status | Task | Notes |
|---|---|---|---|
| D42 | ✅ | Mobile responsive layout | All pages use Tailwind responsive classes |
| D43 | ⬜ | Image optimisation for Nigerian internet speeds | Product images are unoptimised JPGs/PNGs. Needs WebP conversion, `srcset`, and lazy loading (`loading="lazy"`) on all `<img>` tags |
| D44 | ⬜ | Performance audit & optimisation | Tailwind CDN, no code splitting, no image CDN. After E1 (PostCSS migration) run Lighthouse audit and address issues |

---

### D — Ownership & Infrastructure

> These are non-code deliverables but must be tracked.

| # | Status | Task | Notes |
|---|---|---|---|
| D45 | ⬜ | Confirm Holis owns the domain name | Verify `prostanone.ng` / `holisbotanicalgardens.com` is registered under Holis's name |
| D46 | ⬜ | Confirm Holis owns the hosting account | Site must be hosted on an account Holis controls |
| D47 | ⬜ | Transfer/set up company-owned database | See D31. Client must own the DB credentials |
| D48 | ⬜ | Hand over CMS credentials to client | On completion, all admin logins must be transferred to Holis |

---

### D — Future Expansion (Backlog)

> Not immediate — log for later sprints.

| # | Status | Task | Notes |
|---|---|---|---|
| D49 | ⬜ | Multi-product architecture | Add additional Holis products beyond Prostanone. Requires product schema + CMS-driven product pages |
| D50 | ⬜ | Affiliate marketing system | Track referrals, affiliate links, commission payouts |
| D51 | ⬜ | Distributor dashboard | Portal for approved distributors to view their orders/commissions |
| D52 | ⬜ | Health blog / education platform | Full blog with categories, author pages, SEO-optimised articles |

---

## Section E — Additional Client Requests

> Items gathered from ongoing client communication will be added here.

| # | Status | Task | File(s) | Notes |
|---|---|---|---|---|
| E1 | ✅ | Migrate Tailwind CSS from CDN to PostCSS package | `package.json`, `index.html`, `vite.config.ts`, new `postcss.config.js` | Currently Tailwind is loaded via `<script src="https://cdn.tailwindcss.com">` in index.html. Must install `tailwindcss`, `postcss`, `autoprefixer` as devDependencies, create `postcss.config.js`, init `tailwind.config.js`, and remove the CDN script tag. Also remove the inline `tailwind.config = { ... }` block from index.html |
| E2 | ✅ | Move all theme tokens and global styles to `global.css` | new `global.css` (or `src/index.css`), `tailwind.config.js`, `index.html` | After migrating to PostCSS (E1), extract all color tokens, font definitions, and any custom CSS (e.g. `.no-scrollbar`) from `index.html` into a `global.css` file using Tailwind's `@theme` / CSS custom properties. Import `global.css` in `index.tsx`. The `tailwind.config.js` should reference or extend from what's defined there rather than duplicating values |

---

## Completed Items

| # | Task | Completed On |
|---|---|---|
| — | Initial codebase documentation (DOCUMENTATION.md) | March 22, 2026 |
| E1 | Migrate Tailwind CSS from CDN to PostCSS package | March 22, 2026 |
| E2 | Move all theme tokens and global styles to `global.css` | March 22, 2026 |

---

*Last updated: March 22, 2026 — E1 + E2 completed (Tailwind CDN → PostCSS migration + global.css centralization)*
