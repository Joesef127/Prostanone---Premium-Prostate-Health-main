# Prostanone — Codebase Documentation

> A complete technical reference for anyone building on this project.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [File & Folder Structure](#3-file--folder-structure)
4. [Entry Points & App Shell](#4-entry-points--app-shell)
5. [Global State (AppContext)](#5-global-state-appcontext)
6. [Data Layer — Types & Constants](#6-data-layer--types--constants)
7. [Routing & Pages](#7-routing--pages)
8. [Page-by-Page Breakdown](#8-page-by-page-breakdown)
9. [Components](#9-components)
10. [User Flows](#10-user-flows)
11. [Checkout & Payment System](#11-checkout--payment-system)
12. [External Integrations](#12-external-integrations)
13. [Styling System](#13-styling-system)
14. [Public Assets](#14-public-assets)
15. [Environment Variables](#15-environment-variables)
16. [Known Issues & Incomplete Features](#16-known-issues--incomplete-features)
17. [How to Run Locally](#17-how-to-run-locally)

---

## 1. Project Overview

**Prostanone** is a Nigerian e-commerce and marketing website for a herbal prostate health supplement of the same name. It serves as the full funnel — from brand awareness → education → symptom quiz → product recommendation → checkout → order confirmation.

| Detail | Value |
|---|---|
| **Product** | Prostanone herbal prostate supplement (60 tablets per pack) |
| **Distributor** | Holis Botanical Gardens, Lagos, Nigeria |
| **Manufacturer** | Bhargava Phytolab (est. 1920) |
| **Certification** | NAFDAC-certified, GMP-compliant |
| **Primary Market** | Nigerian men aged 40+ experiencing BPH (Benign Prostatic Hyperplasia) symptoms |
| **Currency** | Nigerian Naira (₦) |

The site has no backend of its own. All data is in-memory (React state). Order notifications and analytics go through external webhooks (n8n). Payment is handled by Korapay. Email confirmations handled by formsubmit.co.

---

## 2. Tech Stack

| Category | Technology | Version |
|---|---|---|
| UI Framework | React | ^19.2.4 |
| Language | TypeScript | ~5.8.2 |
| Build Tool | Vite | ^6.2.0 |
| Routing | React Router DOM | ^7.13.0 |
| Animation | Framer Motion | ^12.29.2 |
| Icons | Lucide React | ^0.563.0 |
| CSS | Tailwind CSS (via CDN) | latest |
| Font | Inter (Google Fonts) | — |
| Payment | Korapay (external script / window.Korapay) | — |
| Email | formsubmit.co (REST API, no account needed) | — |
| Automation | n8n webhooks (self-hosted at metrohyp.com) | — |

**Important note on Tailwind:** Tailwind is loaded via `<script src="https://cdn.tailwindcss.com">` in `index.html`, not via PostCSS or a config file. The theme configuration (custom colors etc.) is also defined inline in `index.html` inside a `<script>` block. There is no `tailwind.config.js` file.

---

## 3. File & Folder Structure

```
/
├── index.html              # HTML shell — loads Tailwind CDN, fonts, Korapay, color tokens
├── index.tsx               # React root mount
├── App.tsx                 # Router, global layout, all route definitions
├── types.ts                # TypeScript interfaces and enums
├── constants.ts            # All static data (packages, testimonials, quiz questions, FAQs)
├── vite.config.ts          # Vite config (port 3000, @ alias)
├── tsconfig.json           # TypeScript compiler config
├── package.json            # Dependencies
├── vite-env.d.ts           # Vite env type declarations
├── metadata.json           # (project metadata, not used at runtime)
│
├── context/
│   └── AppContext.tsx       # Global state: cart + quiz result
│
├── components/
│   ├── Button.tsx           # Reusable animated button
│   ├── FAQ.tsx              # Accordion FAQ section
│   ├── Footer.tsx           # Site footer
│   ├── Navbar.tsx           # Fixed top navbar
│   ├── NewsletterPopup.tsx  # Timed email capture modal
│   ├── ProstateDiagram.tsx  # Animated SVG anatomy diagram
│   └── WhatsAppButton.tsx   # Floating WhatsApp CTA
│
├── pages/
│   ├── Home.tsx             # Landing page (hero, symptoms, how-it-works, pricing, FAQ)
│   ├── About.tsx            # Brand/company info
│   ├── Science.tsx          # Ingredient science breakdown
│   ├── Reviews.tsx          # Customer testimonials grid
│   ├── Contact.tsx          # Contact info + simple contact form (no submit handler)
│   ├── Quiz.tsx             # 7-question prostate health assessment
│   ├── Results.tsx          # Quiz results + personalized package recommendation
│   ├── Summary.tsx          # Order review / cart page
│   ├── Checkout.tsx         # 3-step checkout wizard
│   └── ThankYou.tsx         # Post-purchase confirmation screen
│
└── public/
    ├── logo.png
    ├── favicon.png
    ├── Prostanone.png        # Product bottle image
    ├── prostanone-home.jpg   # Pricing section background
    ├── prostanone-about.jpg  # About page hero
    ├── prostanone-science1.jpg
    ├── prostanone-science2.jpg
    └── images/
        ├── Prostanone01.jpg
        ├── Prostanone02.jpg
        ├── Prostanone03.jpg
        └── Prostanone04.jpg  # (4 product images — not currently used in code)
```

---

## 4. Entry Points & App Shell

### `index.html`
The HTML shell. It does several things besides just being a container:

- Loads **Tailwind CSS via CDN** and defines the custom theme config inline
- Loads the **Inter font** from Google Fonts
- Defines a **Content Security Policy** (`<meta http-equiv="Content-Security-Policy">`) allowing `https:` sources
- Has a `<div id="root">` where React mounts
- Loads Vite's `index.tsx` via `<script type="module">`

**Custom Tailwind color tokens (defined in index.html):**
```
primary:    #6B1B4D  (deep purple — main brand color)
secondary:  #4A1435  (darker purple — footers, hero backgrounds)
accent:     #D4AF37  (gold — highlights, badges, CTAs)
background: #F5F5F7  (near-white grey — page backgrounds)
text:       #1D1D1F  (near-black)
text-muted: #6E6E73  (grey for secondary text)
success:    #34C759
error:      #FF3B30
```

### `index.tsx`
Barebone React root. Creates a `ReactDOM.createRoot` on `#root` and renders `<App />` wrapped in `React.StrictMode`.

### `App.tsx`
The top-level application component. Sets up:

1. **`<AppProvider>`** — Wraps the entire app in global state context
2. **`<HashRouter>`** — Uses hash-based routing (URLs look like `yourdomain.com/#/quiz`). This means the app can be deployed to any static file host without server-side routing configuration.
3. **`<ScrollToTop>`** — A small utility component (defined inline in App.tsx) that calls `window.scrollTo(0, 0)` on every `pathname` change, so every page loads at the top
4. **Global layout shell:**
   - `<Navbar />` — always visible at top
   - `<WhatsAppButton />` — floating button (hides on checkout/quiz)
   - `<NewsletterPopup />` — timed email capture (appears after 5s on first visit)
   - `<main>` — all page routes render here
   - `<Footer />` — always visible at bottom

**All routes:**
```
/            → Home
/about       → About
/science     → Science
/reviews     → Reviews
/quiz        → Quiz
/results     → Results
/summary     → Summary (cart)
/contact     → Contact
/checkout    → Checkout
/thank-you   → ThankYou
```

---

## 5. Global State (AppContext)

**File:** `context/AppContext.tsx`

The entire app's shared state is held in a single React Context. There is NO localStorage persistence — if the user refreshes the page, all cart items and quiz results are lost.

### State shape:
```typescript
{
  cart: CartItem[];          // Array of { packageId: string, quantity: number }
  quizResult: QuizResult | null;  // Quiz score + severity + raw answers
}
```

### Exposed functions:
| Function | What it does |
|---|---|
| `addToCart(packageId, quantity?)` | Adds item to cart; if already in cart, increments quantity |
| `removeFromCart(packageId)` | Removes item entirely |
| `updateQuantity(packageId, quantity)` | Sets quantity; ignores values < 1 |
| `clearCart()` | Empties the cart (called on ThankYou page) |
| `setQuizResult(result)` | Stores quiz outcome |

### How to consume:
```tsx
import { useApp } from '../context/AppContext';

const { cart, addToCart, quizResult } = useApp();
```

`useApp()` will throw if used outside of `<AppProvider>`.

---

## 6. Data Layer — Types & Constants

### `types.ts`

All TypeScript interfaces used across the project:

```typescript
// A customer review
Testimonial { id, name, age, location, text, rating }

// A purchasable product option
ProductPackage { id, name, containers, price, originalPrice?, 
                 description, subtitle?, savings?, savingsText?, 
                 badge?, recommendedFor?, deliveryText?, usageNote? }

// A quiz question
QuizQuestion { id, text, options: { text, score }[] }

// Severity classification from quiz
enum QuizSeverity { MILD, MODERATE, SEVERE }

// An item in the cart
CartItem { packageId: string, quantity: number }

// The result of completing the quiz
QuizResult { score: number, severity: QuizSeverity, answers: Record<number, number> }
```

### `constants.ts`

All static content lives here. Nothing is fetched from an API.

#### `PACKAGES` — The 3 product options:

| ID | Name | Containers | Price | Original Price | Notes |
|---|---|---|---|---|---|
| `option-a` | Starter Pack | 1 | ₦15,000 | ₦15,000 | No discount |
| `option-b` | Most Valuable Package | 3 | ₦41,000 | ₦45,000 | "BEST VALUE" badge; highlighted in UI |
| `option-c` | Loyalty Pack | 9 | ₦117,000 | ₦135,000 | Save ₦18,000 |

Each pack contains **60 tablets**. So option-a = 60 tabs, option-b = 180 tabs, option-c = 540 tabs.

#### `TESTIMONIALS` — 8 customer testimonials  
Names, ages, locations, testimonial text (real customer quotes), all rated 5 stars. Some entries have `null` age/location.

#### `QUIZ_QUESTIONS` — 7 questions (IPSS-style assessment):
1. Age group (0–4 score range)
2. Nocturia frequency (0–5 range)
3. Difficulty starting urination (0–5 range)
4. Incomplete bladder emptying (0–5 range)
5. Urine stream strength (0–5 range)
6. Urgency frequency (0–5 range)
7. Quality of life impact (0–5 range)

Maximum possible score: 4 + 5 + 5 + 5 + 5 + 5 + 5 = **34**

#### `NAV_LINKS` — Navigation items:
`Home (/), About (/about), Science (/science), Reviews (/reviews), Contact (/contact)`

Note: Quiz, Summary, Checkout, Results, ThankYou are intentionally NOT in nav links (they're funnel pages).

#### `FAQS` — 8 FAQ items  
Questions about what the product is, how it works, timeline, side effects, drug interactions, dosage, NAFDAC approval, and shipping.

#### `SMALL_PRINT` — 6 trust indicator bullet points  
NAFDAC Certified, 100% Natural, Holis Botanical, Nationwide Delivery, etc.

#### `IMAGES` — **NOTE: This constant is effectively unused**  
It contains `picsum.photos` placeholder URLs for productBox, heroBg, manSmiling, doctor, facility. The actual pages use hardcoded `/public/` paths (e.g., `/prostanone-home.jpg`) directly, not this constant.

---

## 7. Routing & Pages

The app uses **HashRouter**, meaning all navigation uses hash-based URLs:
- `yourdomain.com/` → `yourdomain.com/#/`
- `yourdomain.com/quiz` → `yourdomain.com/#/quiz`

This is important for deployment. Any static host works without redirect rules. When building features that need direct URL access, use `/#/route-name`.

---

## 8. Page-by-Page Breakdown

### `Home.tsx` — The Main Landing Page

The most complex page. Contains several sections top to bottom:

**1. Hero Section**
- Headline: "Transform Your Prostate Health"
- Trust badges: "NAFDAC Certified", "Clinically Backed"
- Two CTAs: "Take Free Prostate Check" → `/quiz` | "View Pricing" → smooth scroll to `#pricing`
- Animated product card mockup (using Framer Motion scroll-linked rotation)
- Product image: `/Prostanone.png`

**2. Problem Awareness Section**
- 4 symptom cards with icons: Waking at Night, Weak Flow, Incomplete Emptying, Urgency
- Scroll-animated (fade in on viewport entry)

**3. How It Works Section**
- Left: `<ProstateDiagram />` SVG animation
- Right: 4 numbered mechanism steps (Inhibition, Anti-Inflammatory, Muscle Relaxation, Diuretic Action)

**4. Social Proof Section**
- Horizontal scrollable testimonial carousel (dark purple background)
- Renders all 8 `TESTIMONIALS` from constants

**5. Pricing Section** (`id="pricing"`)
- Left: sticky product image card (`/prostanone-home.jpg`)
- Right: horizontal scrollable cards for each package (3 total)
- `option-b` card is visually highlighted (dark purple bg, slightly scaled up)
- Each card has a "Select Package" button → calls `addToCart(pkgId)` then navigates to `/summary`
- Below packages: "Small print" info grid

**6. FAQ Section**
- Renders `<FAQ />` component (accordion using `FAQS` constant)

**7. Final CTA Section**
- "Still Unsure?" → button to `/quiz`

---

### `About.tsx`

Two sections:
1. **Our Story** — split layout: text left (company background, Bhargava Phytolab, Holis Botanical), image right (`/prostanone-about.jpg`)
2. **Certified Excellence** — 4 certification badges: NAFDAC Certified, GMP Compliant, Lab Tested, 100% Herbal

No interactivity. Pure marketing content.

---

### `Science.tsx`

Three sections:
1. **Hero** — headline on dark background
2. **Understanding BPH** — explanation + 2 science images + `<ProstateDiagram />` on the right
3. **Clinical Ingredient Profile** — 4 ingredient cards:

| Ingredient | Dose | Function | Clinical Stat |
|---|---|---|---|
| Saw Palmetto Extract | 300mg | Inhibits 5α-reductase, blocks DHT | 25% reduction in nocturia |
| Chimaphila Umbellata | 50mg | Diuretic + anti-inflammatory | Reduces prostate swelling |
| Pareira Brava | 25mg | Muscle relaxant for bladder spasms | Improves bladder emptying |
| Hydrangea Arborescens | 15mg | Diuretic, increases urine flow | Supports healthy flow |

---

### `Reviews.tsx`

- Two sections: dark hero banner, then a masonry-like grid
- Renders `TESTIMONIALS.concat(TESTIMONIALS)` — the 8 testimonials are **doubled** intentionally to create the appearance of more reviews (16 cards shown)
- Each card shows: stars, testimonial text, avatar initial, name, location, "Verified Purchase"

---

### `Contact.tsx`

Two columns:
- **Left:** Contact info cards — WhatsApp phone (08155931140), email (support@holisbotanicals.com), physical address (Km 35 Ikorodu-Itoikin, Lagos)
- **Right:** A contact form (Name, Email, Message fields + Submit button)

**⚠️ The contact form has no `onSubmit` handler** — clicking "Send Message" does nothing. This needs to be implemented.

---

### `Quiz.tsx` — The Prostate Assessment

**State:** `currentQuestionIndex`, `answers` (Record<questionId, score>)

**Logic:**
- Shows one question at a time with animated transitions (Framer Motion `AnimatePresence`)
- Progress bar at top fills as user advances
- Clicking an answer immediately advances to the next question (300ms delay)
- No explicit "Next" button — selecting an option IS the action
- Back button visible from question 2 onwards
- On last question answered → calls `calculateResult()`

**Score Calculation:**
```
Sum all answer scores across all 7 questions

score 0–7   → QuizSeverity.MILD
score 8–19  → QuizSeverity.MODERATE
score 20+   → QuizSeverity.SEVERE
```

Calls `setQuizResult()` (stores in AppContext) then navigates to `/results`.

---

### `Results.tsx` — Quiz Results & Recommendation

**Guard:** If `quizResult` is null (user landed here directly), redirects to `/quiz`.

**Package recommendation logic:**
```
MILD     → option-a (1 pack)
MODERATE → option-b (3 packs) "Most Valuable Package"
SEVERE   → option-c (9 packs) "Loyalty Pack"
```

**Left card — Analysis:**
- Color-coded severity label (green=MILD, yellow=MODERATE, red=SEVERE)
- Score display + severity-specific text
- 3 symptom bullet points
- **Recovery Timeline Chart** — animated bar chart (Framer Motion). Shows projected health improvement timeline:
  - MILD: Week 0 → Week 4 (4 bars)
  - MODERATE: Week 0 → Week 16 (4 bars)
  - SEVERE: Month 0 → Month 6 (4 bars)

**Right card — Recommended Protocol:**
- Shows the recommended package name, price (strikethrough original + current)
- Usage note, delivery info
- **"Get Your Personalized Package"** button → calls `addToCart(recommendedPackage.id)` + navigates to `/summary`
- **Pulsing animation** on the CTA button (repeating scale animation via Framer Motion)
- Secondary "Read the Science" link → opens `/science` in new tab

---

### `Summary.tsx` — Order Review (Cart)

**Guard:** If cart is empty, shows "Your cart is empty" + "Return to Home" link.

Displays all items currently in the cart:
- Product image (`/Prostanone.png`)
- Package name, description
- Packs count + tablet count calculation: `60 * containers * quantity`
- Delivery text, usage note
- Quantity +/- controls (calls `updateQuantity`)
- Line total price
- Savings badge if applicable
- "Remove" link (calls `removeFromCart`)

**Bottom bar:**
- Total amount (subtotal only, no delivery fee yet — that's calculated in checkout based on address)
- "Secure Checkout" button → navigates to `/checkout`

---

### `Checkout.tsx` — 3-Step Purchase Wizard

This is the most complex file. See [Section 11](#11-checkout--payment-system) for full details.

---

### `ThankYou.tsx`

**On mount:** Calls `clearCart()` via `useEffect`.

Shows:
- Large green checkmark animation
- "Order Confirmed!" heading
- Thank you message mentioning email confirmation
- Next Steps list: check email, delivery 3-5 days, dosage instructions
- "Return Home" button (navigates to `/` + resets hash)

---

## 9. Components

### `Button.tsx`

A wrapper around Framer Motion's `motion.button`. Extends `HTMLMotionProps<"button">` so all Framer Motion props (like `animate`, `transition`) can be passed in.

**Props:**
- `variant`: `'primary'` (default) | `'secondary'` | `'outline'` | `'ghost'`
- `size`: `'sm'` | `'md'` | `'lg'` (default: `'md'`)
- `fullWidth`: boolean (default false)
- All standard button + motion props pass through

**Variants:**
```
primary:  bg-primary (purple), white text, shadow
secondary: bg-accent (gold), white text
outline:   border-primary, primary text, transparent bg
ghost:     no bg/border, primary text
```

**Micro-interactions:** `whileHover={{ scale: 1.02, y: -1 }}` and `whileTap={{ scale: 0.98 }}` on all buttons.

---

### `Navbar.tsx`

**Behavior:**
- Completely transparent with `py-6` when at top of page (`scrolled = false`)
- White/frosted glass (`bg-white/90 backdrop-blur-md shadow-md py-4`) when scrolled > 20px
- Auto-closes mobile menu when route changes (listens to `location`)

**Desktop layout:** Logo | Nav links | Cart icon (badge shows count) | "Check Prostate Health" button

**Mobile layout:** Logo | Cart icon | Hamburger → full-screen overlay with nav links

**Cart badge:** Reads total quantity from `AppContext`, shows orange badge when > 0.

---

### `Footer.tsx`

4-column grid (stacks to 1 column on mobile):
1. **Brand:** Logo (inverted white), tagline, social icons (Twitter, Facebook, Instagram — all `href="#"` placeholders)
2. **Quick Links:** From `NAV_LINKS` + Quiz link
3. **Contact:** Phone (wa.me link), email, hours, physical address
4. **Legal:** Privacy Policy, Terms, Refund Policy, Shipping Policy — all `href="#"` placeholders (not implemented)

---

### `ProstateDiagram.tsx`

An inline SVG anatomical diagram showing:
- **Bladder** (grey path, top)
- **Urethra** (yellow rectangle, center)
- **Prostate lobes** (two mirrored paths), left and right

**Animation:** When the diagram scrolls into view (`whileInView`), the prostate lobes animate from red/enlarged state to pink/normal — visually representing the product's effect of reducing prostate swelling. This resets when scrolled out and re-animates when scrolled back in (`viewport={{ once: false }}`).

Used in both `Home.tsx` (How It Works section) and `Science.tsx`.

---

### `FAQ.tsx`

Accordion component. Reads from `FAQS` constant in `constants.ts`.

Each `FAQItem`:
- Toggle button with question text + chevron icon
- Animated expand/collapse using Framer Motion `AnimatePresence` with `height: 0 → auto`
- Answer text shown when open



---

### `WhatsAppButton.tsx`

- Fixed, bottom-right, z-50
- Green circle button with `MessageCircle` icon
- `href="https://wa.me/2348155931140"` — deeplinks to WhatsApp chat
- **Hidden on `/checkout` and `/quiz`** to avoid distraction during key conversion moments
- Entrance animation: scale in from 0; hover: scale 1.1; tap: scale 0.9

---

### `NewsletterPopup.tsx`

**Trigger:** Fires after 5-second delay IF `localStorage.getItem('prostanone_newsletter_seen')` is falsy.

**Dismissal:** Sets `localStorage.setItem('prostanone_newsletter_seen', 'true')` — so it only appears once per browser.

**Form fields:** First Name + Email

**Validation:**
- Name: min 3 chars, letters/spaces/hyphens/dots only (no numbers/symbols)
- Email: regex + local part length check + domain check + blocks repeated-character patterns (e.g., `aaaaa@...`)

**On submit:** POST to `VITE_NEWSLETTER_WEBHOOK_URL` (n8n) with:
```json
{
  "name": "...",
  "email": "...",
  "source": "Newsletter Popup",
  "date": "2026-03-22T10:00:00.000+01:00"
}
```

Date is adjusted to WAT (UTC+1) by adding 1 hour to `new Date()`.

**Success state:** Shows success message, auto-closes after 3 seconds.

---

## 10. User Flows

### Flow A: Direct Purchase (from Homepage)

```
Home (load page)
  ↓
Scroll to Pricing section (#pricing) OR click "View Pricing"
  ↓
Click "Select Package" on any of the 3 package cards
  ↓  (addToCart called, navigate to /summary)
Summary — review cart, optional quantity changes
  ↓  (click "Secure Checkout")
Checkout Step 1 — Contact info (name, email, phone)
  ↓  (validates, sends webhook: contact_info_entered)
Checkout Step 2 — Shipping (address, city, state, notes)
  ↓  (validates, sends webhook: shipping_entered)
Checkout Step 3 — Payment review
  ↓  (click "Pay Now")
Korapay payment modal opens
  ↓  (user completes payment)
formsubmit.co email sent, webhook: payment_completed
  ↓  (navigate to /thank-you)
ThankYou page — cart cleared
```

### Flow B: Quiz-Guided Purchase

```
Home → "Take Free Prostate Check" button   OR   Navbar → "Check Prostate Health"
  ↓
Quiz page (/quiz)
  7 questions, one at a time, animated
  ↓  (auto-advances on answer selection)
calculateResult() → stores in AppContext → navigate to /results
  ↓
Results page (/results)
  Shows severity (MILD / MODERATE / SEVERE)
  Shows analysis + recovery timeline chart
  Shows recommended package
  ↓  (click "Get Your Personalized Package")
  addToCart(recommendedPackageId) → navigate to /summary
  ↓
[continues as Flow A from Summary step]
```

### Flow C: Newsletter Capture (passive)

```
Any page, first visit
  ↓  (5 seconds elapse)
NewsletterPopup modal appears
  ↓  (user fills name + email and submits)
POST to n8n newsletter webhook
  ↓  (success)
"Thanks for subscribing!" shown
Auto-closes after 3 seconds
localStorage key set → popup won't show again
```

### Flow D: WhatsApp Support

Available as a floating button on all pages except `/checkout` and `/quiz`.
Opens `https://wa.me/2348155931140` in a new tab/app.

---

## 11. Checkout & Payment System

`Checkout.tsx` is the most complex file. Here is a full breakdown.

### 3-Step Wizard

```
Step 1: Contact Info
  Fields: Full Name, Email, Phone
  Validation:
    - Name: must have 2+ parts, each 2+ chars, only letters/spaces/hyphens/dots
    - Email: regex + length + domain + no repeated-char patterns
    - Phone: Nigerian format regex: /^(\+234|0)[789][01]\d{8}$/
  On valid → sendCheckoutProgress(1, 'contact_info_entered') → advance to Step 2

Step 2: Shipping Info
  Fields: Delivery Address, City/LGA, State (dropdown), Order Notes
  Validation:
    - Address: min 10 chars
    - City: min 3 chars
  On valid → sendCheckoutProgress(2, 'shipping_entered') → advance to Step 3

Step 3: Payment Review
  Shows: order summary, delivery fee, total
  "Pay Now" button → opens Korapay modal
```

### Delivery Fee Calculation

```typescript
const isLagos = formData.state.toLowerCase() === 'lagos';
const isExcluded = address/city contains 'badagry' OR 'epe';

deliveryFee = (isLagos && !isExcluded) ? 0 : 3000;
```

Lagos delivery is free **except** for Badagry and Epe (detected by text matching on address and city fields).

### Payment Order Reference

Generated once when component mounts:
```typescript
const [reference] = useState(`PR-${Date.now()}-${Math.floor(Math.random() * 1000)}`);
```

This reference stays the same for the entire checkout session.

### Korapay Integration

```typescript
window.Korapay.initialize({
  key: VITE_KORAPAY_PUBLIC_KEY,  // or test key fallback
  amount: total,
  currency: "NGN",
  reference: reference,
  customer: { name, email },
  onClose: () => { sendCheckoutProgress(3, 'payment_abandoned'); },
  onSuccess: async (data) => { /* see below */ },
  onFailed: (data) => { sendCheckoutProgress(3, 'payment_failed', data); }
});
```

**Note:** `window.Korapay` must be loaded as an external script in `index.html` for this to work. There is a guard that shows an alert if it isn't available.

### On Payment Success

Two things happen in sequence:

**1. Send order confirmation email via formsubmit.co:**
```
POST https://formsubmit.co/ajax/sales@holisbotanicals.com
  - Sends email to sales@holisbotanicals.com
  - CC'd to customer's email
  - Template: "table"
  - Includes: customer info, order summary, subtotal, delivery fee, total, notes
```

**2. Send webhook to n8n:**
```
POST VITE_ORDERS_WEBHOOK_URL
  status: 'payment_completed'
  Includes all customer/order data
```

Then navigate to `/thank-you`. Even if the email/webhook fail (try/catch), the user still lands on ThankYou since the payment already succeeded.

### Webhook Payload (all 3 events)

Every call to `sendCheckoutProgress()` sends this shape:
```json
{
  "name": "...",
  "email": "...",
  "phone": "...",
  "shipping_address": "...",
  "items_ordered": "1x Starter Pack (₦15,000)",
  "notes": "...",
  "payment_reference": "PR-...",
  "payment_status": "(only on step 3)",
  "total_amount": 15000,
  "checkout_step": "contact_info_entered | shipping_entered | payment_completed | payment_abandoned | payment_failed",
  "date": "2026-03-22T10:00:00.000+01:00"
}
```

This enables **abandoned cart recovery** — n8n receives contact info at step 1, so even if the user never pays, their details are captured.

---

## 12. External Integrations

### 1. Korapay (Payment)
- **Role:** Accept Nigerian Naira payments online
- **How:** External window-level SDK (`window.Korapay`)
- **Key env var:** `VITE_KORAPAY_PUBLIC_KEY`
- **Test key fallback:** `pk_test_qPwbCqQCurnRJCuhoQZTZxstUvpjsGqBbBq44bKZ`
- **Docs:** https://korapay.com/docs

### 2. n8n Webhooks (Order Tracking + Newsletter)
- **Role:** Receive checkout progress events and newsletter signups; presumably routes them to Google Sheets, email, CRM, etc.
- **Base URL:** `https://n8n.metrohyp.com` (self-hosted instance)
- **Order webhook:** `/webhook/prostanone-orders` (env: `VITE_ORDERS_WEBHOOK_URL`)
- **Newsletter webhook:** `/webhook/prostanone-newsletter` (env: `VITE_NEWSLETTER_WEBHOOK_URL`)
- These webhooks enable abandoned cart recovery (data captured at step 1 before payment)

### 3. formsubmit.co (Email Confirmation)
- **Role:** Send order confirmation email to business + customer CC
- **How:** REST POST to `https://formsubmit.co/ajax/sales@holisbotanicals.com`
- **No account/API key needed** — formsubmit.co is a no-backend email relay
- **Template used:** `_template: "table"` (formatted table layout)
- **Triggered only on payment success**

---

## 13. Styling System

Tailwind CSS is used but **loaded via CDN** (not build-time PostCSS). The theme is configured inline in `index.html`.

### Design Tokens

| Token | Value | Usage |
|---|---|---|
| `primary` | `#6B1B4D` | Main brand purple — buttons, headings, borders |
| `secondary` | `#4A1435` | Darker purple — footer, hero backgrounds |
| `accent` | `#D4AF37` | Gold — badges, highlight CTAs, icons |
| `background` | `#F5F5F7` | Page backgrounds (near-white grey) |
| `text` | `#1D1D1F` | Body text |
| `text-muted` | `#6E6E73` | Secondary text |
| `surface` | `#FFFFFF` | Card backgrounds |
| `success` | `#34C759` | Success states |
| `error` | `#FF3B30` | Error states |

### Typography

Font: **Inter** (loaded from Google Fonts). Fallback stack: `-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial`.

### Animation

All animations use **Framer Motion**. Patterns used:
- `initial / animate` — page load animations
- `whileInView` — scroll-triggered animations
- `AnimatePresence` — enter/exit transitions (quiz question transitions, FAQ accordion, mobile menu)
- `useScroll + useTransform` — scroll-linked animations (hero product card rotation)
- `whileHover / whileTap` — micro-interactions on `<Button>`

### Utility Classes
- `no-scrollbar` — custom CSS in index.html to hide scrollbar on horizontal scrollers (pricing carousel, testimonials)
- `snap-x`, `snap-center`, `snap-mandatory` — CSS scroll snapping on carousels

---

## 14. Public Assets

All static assets served from `/public/`. Referenced in code as absolute paths `/filename`.

| File | Used In |
|---|---|
| `/logo.png` | Navbar, Footer |
| `/favicon.png` | index.html `<link>` |
| `/Prostanone.png` | Hero card (Home), Summary page |
| `/prostanone-home.jpg` | Pricing section (Home) |
| `/prostanone-about.jpg` | About page |
| `/prostanone-science1.jpg` | Science page |
| `/prostanone-science2.jpg` | Science page |
| `/images/Prostanone01-04.jpg` | **Currently not used in any code** |

---

## 15. Environment Variables

Create a `.env` file in the project root:

```env
VITE_KORAPAY_PUBLIC_KEY=pk_live_xxxxxxxxxxxxxxxxxxxxxxxx
VITE_ORDERS_WEBHOOK_URL=https://n8n.metrohyp.com/webhook/prostanone-orders
VITE_NEWSLETTER_WEBHOOK_URL=https://n8n.metrohyp.com/webhook/prostanone-newsletter
```

**Fallback values in code (safe for development):**
- Korapay: falls back to a test public key
- Webhooks: fall back to the live n8n URLs (the defaults are the actual production URLs!)

**Security note:** All `VITE_` variables are exposed in the browser bundle. Never put secret keys with server-side power in `VITE_` variables. Korapay public keys are safe (they're meant to be public). The n8n webhook URLs being exposed is acceptable for this use case.

---

## 16. Known Issues & Incomplete Features

These are things you should be aware of as you build on this codebase:

### 🔴 Broken / Non-functional

1. **Contact form has no submit handler** (`Contact.tsx`) — The form renders but does nothing when submitted. Needs an `onSubmit` handler + probably a formsubmit.co or webhook integration.

2. **Korapay requires external script** — `window.Korapay` is used in `Checkout.tsx` but the `<script>` tag loading the Korapay SDK may not be present in `index.html`. Verify this before testing payments. If missing, add: `<script src="https://cdn.korapay.com/charge.min.js"></script>`.

3. **Legal page links are `#` placeholders** — Privacy Policy, Terms of Service, Refund Policy, Shipping Policy are all linked from the Footer but just scroll to top (they link to `#`). These pages don't exist.

4. **Social media links are `#` placeholders** — Twitter, Facebook, Instagram in Footer link to `#`.

### 🟡 Missing Persistence / UX Issues

5. **Cart not persisted to localStorage** — Refreshing the page empties the cart. Users can lose their selection if they accidentally refresh during checkout.

6. **Quiz result not persisted** — Refreshing while on `/results` redirects to `/quiz`. Users have to retake the quiz.

7. **No cart indicator on mobile Navbar** when cart is has items (actually there IS one, but verify the mobile layout shows it correctly in all cases).

### 🟠 Data / Content Issues

8. **`IMAGES` constant in `constants.ts` is unused** — It contains `picsum.photos` placeholders and is never imported by any page. The pages use hardcoded `/public/` paths directly. The IMAGES constant can be removed or updated.

9. **NAFDAC Reg No: "A7-1234L"** on the Hero product card appears to be a placeholder value. Verify with the client.

10. **Reviews page doubles testimonials** — `TESTIMONIALS.concat(TESTIMONIALS)` renders all 8 reviews twice (16 cards), creating the appearance of more reviews. Intentional, but worth noting.

11. **`public/images/` folder (Prostanone01-04.jpg)** — 4 product images exist but are not referenced anywhere in the codebase. These might be intended for a product gallery or carousel that hasn't been built yet.

12. **Footer email mismatch** — Contact.tsx says `support@holisbotanicals.com` but Footer shows `support@prostanone.ng`. Align these.

### 🔵 Architecture Notes

13. **HashRouter vs BrowserRouter** — The app uses `HashRouter`. This means URLs like `/#/quiz` not `/quiz`. If you ever switch to BrowserRouter for cleaner URLs, you'll need server-side redirect rules configured (e.g., Netlify `_redirects`, Vercel `vercel.json`, nginx config).

14. **Tailwind via CDN** — Fine for a low-traffic marketing site, but suboptimal for performance. If adding many new pages/components, consider migrating to Tailwind as a build-time PostCSS plugin for better purging and bundle size.

15. **No error boundary** — If any component throws, the entire app white-screens. Consider adding a top-level error boundary.

---

## 17. How to Run Locally

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation & Development
```bash
# Install dependencies
npm install

# Start dev server (runs on port 3000)
npm run dev

# Open in browser
# http://localhost:3000
```

### Production Build
```bash
npm run build
# Output goes to /dist/

npm run preview
# Preview the production build locally
```

### Environment Setup
Copy and fill in your keys:
```bash
# Create .env file
echo "VITE_KORAPAY_PUBLIC_KEY=your_key_here" > .env
echo "VITE_ORDERS_WEBHOOK_URL=https://your-n8n.com/webhook/prostanone-orders" >> .env
echo "VITE_NEWSLETTER_WEBHOOK_URL=https://your-n8n.com/webhook/prostanone-newsletter" >> .env
```

### Key Things to Test Locally
1. Since using HashRouter, navigate to `http://localhost:3000` — all routes use `#/path`
2. Quiz flow: `/#/quiz` → answer all 7 questions → `/#/results`
3. Direct purchase: homepage → scroll to pricing → "Select Package" → `/#/summary` → `/#/checkout`
4. Newsletter popup: wait 5 seconds on first load (clear localStorage to re-trigger: `localStorage.removeItem('prostanone_newsletter_seen')`)
5. To test payment, use Korapay test card numbers from their documentation

---

*Documentation last updated: March 2026*
