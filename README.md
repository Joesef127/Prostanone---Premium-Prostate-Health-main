# Prostanone — Premium Prostate Health

**A modern, full-funnel e-commerce platform for Nigeria's leading herbal prostate health supplement.**

> NAFDAC-certified | Clinically formulated | 100% natural | Results in 4–6 weeks

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Development](#development)
- [Project Architecture](#project-architecture)
- [Project Structure](#project-structure)
- [Key Concepts](#key-concepts)
- [Pages & Routes](#pages--routes)
- [State Management](#state-management)
- [Styling System](#styling-system)
- [Payment Integration](#payment-integration)
- [External Integrations](#external-integrations)
- [Testing](#testing)
- [Building for Production](#building-for-production)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Common Tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)
- [Additional Resources](#additional-resources)

---

## Project Overview

**Prostanone** is a full-stack e-commerce marketing website for a premium herbal prostate health supplement targeted at Nigerian men aged 40+ experiencing BPH (Benign Prostatic Hyperplasia) symptoms.

### Key Details

| Attribute | Value |
| --- | --- |
| **Product** | Prostanone herbal prostate supplement (60 tablets/pack) |
| **Distributor** | Holis Botanical Gardens, Lagos, Nigeria |
| **Manufacturer** | Bhargava Phytolab (est. 1920, India) |
| **Certification** | NAFDAC-certified, GMP-compliant |
| **Primary Market** | Nigerian men aged 40+ with prostate concerns |
| **Currency** | Nigerian Naira (₦) |
| **URL** | https://www.holisbotanicals.com |

### The Sales Funnel

The website guides users through a complete customer journey:

1. **Awareness** → Landing page with symptoms, benefits, and brand story
2. **Education** → Science page with ingredient breakdown
3. **Assessment** → Interactive 7-question prostate health quiz
4. **Recommendation** → Personalized package suggestion based on quiz results
5. **Social Proof** → Testimonials and reviews from existing customers
6. **Checkout** → Secure payment via Korapay
7. **Confirmation** → Order receipt and thank you page

---

## Key Features

### 🎯 Core Features

- **Interactive Quiz System** — 7-question assessment that evaluates prostate health symptoms and recommends appropriate packages
- **Dynamic Product Recommendations** — Quiz results trigger personalized package suggestions
- **Responsive Design** — Mobile-first approach optimized for Nigerian market (high mobile traffic)
- **Dark Mode Support** — Full theme toggle with persistent user preference
- **Animated Components** — Smooth transitions and micro-interactions using Framer Motion
- **SEO Optimized** — Comprehensive meta tags, structured data, and SEO tooling

### 🛒 E-Commerce Features

- **Shopping Cart** — Add/remove products, adjust quantities
- **Multiple Package Options** — Standard, Plus, and Premium tiers
- **Secure Checkout** — Korapay/Payaza integration for safe payment processing
- **Order Management** — Cart persistence and session handling
- **Payment Status Tracking** — Post-purchase confirmation page

### 📱 Marketing & Engagement

- **Newsletter Popup** — Timed email capture modal to build subscriber list
- **WhatsApp Integration** — Floating button for direct customer support
- **Testimonials & Reviews** — Customer success stories with images
- **Blog System** — Markdown-based blog with admin creation interface
- **Distributor Portal** — Dedicated page for wholesale inquiries

### 🔐 Admin Features

- **Protected Admin Routes** — Secure login for admin users
- **Blog Management** — Create and publish blog posts
- **Admin Dashboard** — Profile and content management interface

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
| --- | --- | --- |
| **React** | ^19.2.4 | UI framework |
| **TypeScript** | ~5.8.2 | Type-safe development |
| **React Router** | ^7.13.0 | Client-side routing |
| **Tailwind CSS** | ^4.2.2 | Utility-first styling |
| **Framer Motion** | ^12.29.2 | Animations & transitions |
| **Lucide React** | ^0.563.0 | Icon library |

### Build & Development

| Technology | Version | Purpose |
| --- | --- | --- |
| **Vite** | ^6.2.0 | Fast build tool & dev server |
| **TypeScript** | ~5.8.2 | Type checking |
| **Vitest** | ^3.1.1 | Unit testing framework |
| **Testing Library** | Latest | Component testing utilities |

### External Services

| Service | Purpose |
| --- | --- |
| **Korapay** | Payment processing |
| **Payaza** | Payment processing |
| **Vercel** | Hosting & deployment |
| **Vercel Analytics** | Usage tracking |

### Data & Content

- **In-memory State** — All data stored in React context (no backend database)
- **Markdown** — Blog content stored as markdown files
- **localStorage/sessionStorage** — Client-side persistence for cart and quiz results

---

## Prerequisites

Before you start, ensure you have:

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **npm** v9+ or **yarn** v3+
- **Git** (for version control)
- **A text editor** — VS Code recommended
- **An internet connection** (for external APIs)

### Optional but Recommended

- **Korapay Account** — For testing payment functionality
- **Vercel Account** — For deployment ([Sign up](https://vercel.com))

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Joesef127/Prostanone---Premium-Prostate-Health.git
cd Prostanone---Premium-Prostate-Health
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update `.env` with your configuration (see [Environment Variables](#environment-variables) section).

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at **http://localhost:3000**

### 5. Verify Installation

- [ ] Homepage loads without errors
- [ ] Can navigate through all pages
- [ ] Dark mode toggle works
- [ ] Quiz functionality works
- [ ] No console errors

---

## Development

### Available Commands

```bash
# Start development server (hot reload enabled)
npm run dev

# Start API server in development mode
npm run dev:api

# Build for production
npm run build

# Preview production build locally
npm preview

# Run tests
npm run test

# Run tests once (CI mode)
npm run test:run

# Generate test coverage report
npm run test:coverage

# Database commands
npm run db:generate    # Generate schema migrations
npm run db:push        # Push migrations to database
npm run db:seed        # Seed database with initial data
```

### Development Workflow

1. **Create feature branch** from `dev`:
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make your changes** and test locally:
   ```bash
   npm run dev
   npm run test
   ```

3. **Commit with clear messages**:
   ```bash
   git commit -m "feat: add new quiz question"
   ```

4. **Push and open Pull Request** to `dev` branch

### Hot Module Replacement (HMR)

The dev server automatically reloads when you edit files. Just save your changes and see them instantly in the browser.

---

## Project Architecture

### High-Level Overview

```
┌─────────────────────────────────────────┐
│           Prostanone Website            │
├─────────────────────────────────────────┤
│          React + TypeScript             │
│   (Router, Context, Components)         │
├─────────────────────────────────────────┤
│   Tailwind CSS | Framer Motion          │
│   Lucide Icons | Browser APIs           │
├─────────────────────────────────────────┤
│       External Services                 │
│  ├─ Korapay (Payments)                  │
│  ├─ formsubmit.co (Forms)               │
│  ├─ n8n (Webhooks/Automation)           │
│  └─ Vercel Analytics                    │
└─────────────────────────────────────────┘
```

### Data Flow

```
User Interaction
    ↓
React Component
    ↓
Context (Global State)
    ↓
localStorage/sessionStorage (Persistence)
    ↓
External APIs (Payment, Forms, Analytics)
```

### Key Architectural Decisions

1. **Client-First Architecture** — All business logic runs in the browser for speed and simplicity
2. **Context API for State** — Centralized state management via React Context (no Redux/Zustand)
3. **Composition Pattern** — Reusable, composable components for maintainability
4. **Type Safety** — Full TypeScript to catch errors at compile time
5. **SEO-First** — Comprehensive meta tags and structured data for search visibility

---

## Project Structure

### Directory Layout

```
├── components/              # Reusable React components
│   ├── about/              # About page components
│   ├── admin/              # Admin dashboard components
│   ├── blog/               # Blog-related components
│   ├── checkout/           # Checkout & cart components
│   ├── contact/            # Contact form components
│   ├── distributor/        # Distributor page components
│   ├── home/               # Homepage components
│   ├── product-page/       # Product page components
│   ├── skeleton-loaders/   # Loading state placeholders
│   ├── ui/                 # Generic UI components (Modal, etc.)
│   ├── Button.tsx          # Animated CTA button
│   ├── FAQ.tsx             # Reusable FAQ accordion
│   ├── Footer.tsx          # Site footer
│   ├── Navbar.tsx          # Top navigation bar
│   ├── NewsletterPopup.tsx # Email capture modal
│   ├── ProstateDiagram.tsx # Animated anatomy diagram
│   ├── ProtectedRoute.tsx  # Auth wrapper for admin routes
│   ├── ThemeToggle.tsx     # Dark/light mode toggle
│   └── WhatsAppButton.tsx  # Floating WhatsApp CTA
│
├── context/                # React Context for global state
│   ├── AppContext.tsx      # Cart + quiz result state
│   ├── AuthContext.tsx     # Admin authentication
│   ├── ModalContext.tsx    # Modal visibility state
│   └── ThemeContext.tsx    # Dark mode preference
│
├── hooks/                  # Custom React hooks
│   ├── useAdminDashboard.ts
│   ├── useCheckout.ts      # Cart & checkout logic
│   ├── useContactForm.ts   # Contact form submission
│   ├── useCreateBlogForm.ts
│   ├── useDistributorForm.ts
│   ├── useDynamicTitle.ts  # Page title management
│   ├── useFinalCTAForm.ts  # CTA form submission
│   ├── usePackageForm.ts
│   ├── usePackages.ts      # Product package data
│   ├── useSeoMeta.ts       # SEO meta tag management
│   └── useTestimonials.ts  # Testimonial data
│
├── lib/                    # Utilities & constants
│   ├── blogData.ts         # Blog post data
│   ├── blogStorage.ts      # localStorage for blog posts
│   ├── blogTemplates.ts    # Blog post templates
│   ├── categoryColors.ts   # Blog category styling
│   ├── constants.ts        # All static data (packages, FAQs, etc.)
│   ├── data.ts             # Product benefits, symptoms, ingredients
│   ├── seo.ts              # SEO utilities & structured data
│   └── index.ts            # Re-exports for convenience
│
├── pages/                  # Full page components (routes)
│   ├── Home.tsx            # Landing page
│   ├── About.tsx           # Brand story & certifications
│   ├── Science.tsx         # Ingredient education
│   ├── Reviews.tsx         # Customer testimonials
│   ├── Quiz.tsx            # Health assessment quiz
│   ├── Results.tsx         # Quiz results & recommendation
│   ├── Summary.tsx         # Order summary
│   ├── Contact.tsx         # Contact information & form
│   ├── Checkout.tsx        # Shopping cart & payment
│   ├── ThankYou.tsx        # Order confirmation
│   ├── PaymentStatus.tsx   # Payment processing status
│   ├── Product.tsx         # Product details page
│   ├── TermsAndConditions.tsx
│   ├── Distributor.tsx     # B2B distributor portal
│   ├── Blog.tsx            # Blog listing page
│   ├── BlogPost.tsx        # Individual blog post
│   ├── CreateBlog.tsx      # Admin blog creation
│   ├── AdminLogin.tsx      # Admin authentication
│   └── AdminProfile.tsx    # Admin dashboard
│
├── policies/               # Markdown policy files
│   └── terms.md           # Terms & conditions
│
├── public/                 # Static assets
│   ├── robots.txt         # SEO robots file
│   └── images/            # Image assets
│
├── scripts/               # Utility scripts
│   └── sheets-webhook.gs  # Google Sheets integration
│
├── server/                # Backend API code (if applicable)
│   ├── app.ts
│   ├── dev.ts
│   ├── index.ts
│   ├── seed.ts
│   ├── db/
│   ├── middleware/
│   └── routes/
│
├── utils/                 # Shared utilities
│   └── delivery.ts        # Delivery calculation logic
│
├── __tests__/             # Test files (mirror project structure)
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── routes/
│   └── utils/
│
├── App.tsx               # Main app component (router definition)
├── index.tsx             # React root mount
├── index.html            # HTML shell (Tailwind CDN, fonts, etc.)
├── types.ts              # TypeScript interfaces & enums
├── vite.config.ts        # Vite build configuration
├── tsconfig.json         # TypeScript compiler options
├── tailwind.config.js    # Tailwind CSS configuration
├── postcss.config.js     # PostCSS configuration
├── package.json          # Dependencies & scripts
├── .env                  # Environment variables (local)
├── .env.example          # Environment variables template
├── vercel.json           # Vercel deployment config
└── README.md             # This file!
```

### File Naming Conventions

| Pattern | Purpose |
| --- | --- |
| `*.tsx` | React components (TSX files) |
| `*.ts` | TypeScript utilities, hooks, constants |
| `*.test.tsx` | Component unit tests |
| `*.test.ts` | Utility/hook unit tests |
| `Index.ts` | Directory export file |
| `[name].md` | Markdown documentation |

---

## Key Concepts

### 1. Context API for State Management

The app uses **React Context** for global state instead of Redux or Zustand:

- **AppContext** — Cart items, quiz results, selected packages
- **AuthContext** — Admin authentication state
- **ThemeContext** — Dark/light mode preference
- **ModalContext** — Modal visibility toggles

**Usage:**

```typescript
import { useAppContext } from './context/AppContext';

export const MyComponent = () => {
  const { cart, addToCart } = useAppContext();
  // ...
};
```

### 2. Quiz & Package Recommendation System

The quiz uses a scoring algorithm to recommend appropriate packages:

1. User answers 7 health assessment questions
2. Each answer adds points based on symptom severity
3. Total score determines recommendation (Standard, Plus, or Premium)
4. Recommendation saved in context and displayed on Results page

**Files:**
- [pages/Quiz.tsx](pages/Quiz.tsx) — Quiz logic
- [pages/Results.tsx](pages/Results.tsx) — Results display
- [hooks/useCheckout.ts](hooks/useCheckout.ts) — Checkout logic

### 3. Routing Structure

React Router manages all page navigation:

```typescript
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/quiz" element={<Quiz />} />
  <Route path="/results" element={<Results />} />
  <Route path="/checkout" element={<Checkout />} />
  <Route path="/admin" element={<ProtectedRoute><AdminProfile /></ProtectedRoute>} />
  {/* ... more routes ... */}
</Routes>
```

**Key Routes:**

| Route | Component | Description |
| --- | --- | --- |
| `/` | Home | Landing page |
| `/about` | About | Company & brand story |
| `/science` | Science | Ingredient education |
| `/reviews` | Reviews | Customer testimonials |
| `/quiz` | Quiz | Health assessment |
| `/results` | Results | Quiz results & recommendation |
| `/checkout` | Checkout | Shopping cart |
| `/thank-you` | ThankYou | Order confirmation |
| `/contact` | Contact | Contact form & info |
| `/blog` | Blog | Blog listing |
| `/blog/:slug` | BlogPost | Individual blog post |
| `/admin/login` | AdminLogin | Admin authentication |
| `/admin` | AdminProfile | Admin dashboard (protected) |

### 4. Data Persistence

The app uses multiple persistence strategies:

- **localStorage** — Persistent data (cart, theme preference)
- **sessionStorage** — Session-only data (quiz results)
- **Context + React State** — Runtime data (form inputs, UI state)

### 5. SEO Implementation

The app includes comprehensive SEO using custom hooks:

```typescript
import { useSeoMeta } from '../hooks/useSeoMeta';

export const MyPage = () => {
  useSeoMeta({
    title: 'Page Title - Prostanone',
    description: 'Meta description...',
    keywords: ['keyword1', 'keyword2'],
    url: PAGE_URLS.mypage,
  });
  // ...
};
```

**SEO Features:**
- Meta tags for every page
- Open Graph tags for social sharing
- Twitter Card tags
- JSON-LD structured data
- Canonical URLs
- Sitemap support
- robots.txt

---

## Pages & Routes

### Public Pages

#### Home (`/`)
Landing page with hero, symptom checklist, how-it-works section, pricing tiers, FAQ, testimonials.

**Key Components:**
- Hero section with CTA
- Symptoms list
- How-it-works timeline
- Product benefits
- Package pricing cards
- FAQ accordion
- Testimonials carousel

#### About (`/about`)
Company story, certifications, team information.

#### Science (`/science`)
Detailed ingredient breakdown with science-backed benefits.

#### Reviews (`/reviews`)
Customer testimonials grid with images and quotes.

#### Quiz (`/quiz`)
Interactive 7-question prostate health assessment.

#### Results (`/results`)
Quiz results display with personalized package recommendation.

#### Checkout (`/checkout`)
Shopping cart with package selection, quantity adjustment, Korapay payment integration.

#### Thank You (`/thank-you`)
Order confirmation page with order number and next steps.

#### Contact (`/contact`)
Contact information and form.

#### Blog (`/blog`)
Blog post listing with search and filtering.

#### Blog Post (`/blog/:slug`)
Individual blog post with markdown rendering.

#### Product (`/product`)
Product details, specifications, benefits.

#### Distributor (`/distributor`)
B2B distributor information and wholesale inquiry form.

### Admin Pages (Protected)

#### Admin Login (`/admin/login`)
Admin authentication via password.

#### Admin Profile (`/admin`)
Admin dashboard for blog management and settings.

#### Create Blog (`/admin/create-blog`)
Blog post creation interface with rich text editor.

---

## State Management

### AppContext

**Purpose:** Global state for cart and quiz results.

**State Shape:**

```typescript
{
  cart: CartItem[];
  quizResult: QuizResult | null;
  selectedPackage: Package | null;
  totalPrice: number;
  // ... methods ...
}
```

**Actions:**

```typescript
const {
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  setQuizResult,
  setSelectedPackage,
} = useAppContext();
```

### AuthContext

**Purpose:** Admin authentication state.

**State Shape:**

```typescript
{
  isAuthenticated: boolean;
  user: AdminUser | null;
  // ... methods ...
}
```

### ThemeContext

**Purpose:** Dark/light mode preference.

**State Shape:**

```typescript
{
  isDarkMode: boolean;
  toggleTheme: () => void;
}
```

### ModalContext

**Purpose:** Global modal visibility state.

**State Shape:**

```typescript
{
  modals: Record<string, boolean>;
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
}
```

---

## Styling System

### Tailwind CSS

The project uses **Tailwind CSS** for utility-first styling. Importantly, Tailwind is loaded via **CDN** in [index.html](index.html), not as a build dependency:

```html
<script src="https://cdn.tailwindcss.com"></script>
```

**Theme Configuration:**

Custom colors, fonts, and theme settings are defined inline in `index.html` using the Tailwind config script:

```html
<script>
  tailwind.config = {
    theme: {
      colors: {
        // Custom colors defined here
      }
    }
  }
</script>
```

### Key Custom Classes

- `.btn` — Button styling
- `.card` — Card container
- `.section-title` — Page section headings
- `.text-gradient` — Gradient text effect

### Dark Mode

Dark mode is implemented using Tailwind's dark mode directive:

```jsx
<div className="bg-white dark:bg-gray-900">
  Light and dark variant
</div>
```

**Preference Storage:**

Dark mode preference is saved to localStorage via ThemeContext.

---

## Payment Integration

### Korapay Setup

Payment processing is handled by **Korapay**, a Nigerian payment processor.

**Integration Points:**

1. **Script Loading** — Korapay SDK loaded in [index.html](index.html)
2. **Checkout Logic** — [pages/Checkout.tsx](pages/Checkout.tsx) initializes payment
3. **Payment Handler** — Custom hook in [hooks/useCheckout.ts](hooks/useCheckout.ts)

**Payment Flow:**

```
User fills checkout form
    ↓
Clicks "Pay Now"
    ↓
Korapay modal opens
    ↓
User enters payment details
    ↓
Payment processed
    ↓
Success → ThankYou page
Failure → Checkout (error shown)
```

**Environment Variables:**

```
VITE_KORAPAY_PUBLIC_KEY=your_public_key
```

### Test Cards

For development, Korapay provides test card numbers. Check Korapay documentation.

---

## External Integrations

### 1. formsubmit.co

**Purpose:** Form submission and email notifications.

**Usage:**

```typescript
const handleSubmit = async (data: FormData) => {
  await fetch('https://formsubmit.co/FORM_ID', {
    method: 'POST',
    body: new FormData(form),
  });
};
```

**Files Using This:**
- [pages/Contact.tsx](pages/Contact.tsx) — Contact form
- [pages/Distributor.tsx](pages/Distributor.tsx) — Distributor inquiry
- [hooks/useContactForm.ts](hooks/useContactForm.ts)

### 2. n8n Webhooks

**Purpose:** Order notifications, analytics, CRM integration.

**Webhook Endpoints:**

- `/webhook/order-created` — Triggered when order is completed
- `/webhook/newsletter-signup` — When user subscribes
- `/webhook/contact-inquiry` — Contact form submission

**Files Using This:**
- [pages/ThankYou.tsx](pages/ThankYou.tsx) — Order confirmation
- [components/NewsletterPopup.tsx](components/NewsletterPopup.tsx) — Newsletter signup

### 3. Vercel Analytics

**Purpose:** Track user engagement and traffic.

**Integration:**

```typescript
import { Analytics } from "@vercel/analytics/react";

export default function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  );
}
```

### 4. Google Fonts

**Purpose:** Typography.

**Font:** Inter (loaded in [index.html](index.html))

---

## Testing

### Test Framework

The project uses **Vitest** with **React Testing Library** for unit and component testing.

### Running Tests

```bash
# Run tests in watch mode
npm run test

# Run tests once (CI)
npm run test:run

# Generate coverage report
npm run test:coverage
```

### Test Files Location

Test files mirror the project structure under `__tests__/`:

```
__tests__/
├── components/
│   ├── FormField.test.tsx
│   ├── OrderSummaryBox.test.tsx
│   └── ...
├── hooks/
│   ├── useCheckout.test.tsx
│   ├── useContactForm.test.ts
│   └── ...
├── lib/
│   ├── seo.test.ts
│   ├── constants.test.ts
│   └── ...
└── pages/
    ├── Quiz.test.tsx
    ├── Results.test.tsx
    └── ...
```

### Writing Tests

**Example Test:**

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../components/Button';

describe('Button', () => {
  it('renders and handles click', async () => {
    const handleClick = vi.fn();
    const { container } = render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByText('Click me');
    await userEvent.click(button);
    
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### Test Coverage

Use the coverage report to identify untested code:

```bash
npm run test:coverage
```

Coverage reports are generated in `coverage/` directory.

---

## Building for Production

### Build Command

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Build Optimizations

- **Code Splitting** — Large components lazy-loaded
- **Tree Shaking** — Unused code removed
- **Minification** — CSS and JS minified
- **Asset Optimization** — Images optimized
- **Source Maps** — Optional for debugging

### Build Output

```
dist/
├── index.html
├── assets/
│   ├── index-xxx.js      # Main bundle
│   ├── chunk-xxx.js      # Lazy-loaded chunks
│   └── style-xxx.css     # Styles
└── favicon.png
```

---

## Deployment

### Deploy to Vercel (Recommended)

1. **Push code to GitHub:**
   ```bash
   git push origin feature/my-feature
   ```

2. **Create Pull Request** on GitHub

3. **Vercel automatically deploys** preview URL from PR

4. **Merge to `main` branch** to deploy to production

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Environment Variables on Vercel

Set environment variables in Vercel dashboard:

1. Go to Project Settings → Environment Variables
2. Add each variable from `.env`
3. Redeploy after adding variables

### Deployment Checklist

- [ ] All tests passing (`npm run test:run`)
- [ ] No console errors in production build
- [ ] All environment variables configured
- [ ] Korapay API keys set
- [ ] Analytics tracking enabled
- [ ] SEO meta tags verified
- [ ] Mobile responsiveness checked
- [ ] Payment flow tested

---

## Environment Variables

### Setup

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

### Required Variables

```env
# Frontend URL (used for redirects, meta tags)
VITE_FRONTEND_URL=http://localhost:3000

# API Base URL (backend API)
VITE_API_BASE=http://localhost:8080

# Korapay Payment Gateway
VITE_KORAPAY_PUBLIC_KEY=your_public_key_here

# Form submission
VITE_FORMSUBMIT_ENDPOINT=your_form_id

# n8n Webhooks
VITE_N8N_WEBHOOK_ORDER=https://your-n8n-instance.com/webhook/order
VITE_N8N_WEBHOOK_NEWSLETTER=https://your-n8n-instance.com/webhook/newsletter
```

### Development vs Production

**Development (.env.local):**

```env
VITE_FRONTEND_URL=http://localhost:3000
VITE_API_BASE=http://localhost:8080
```

**Production (.env.production):**

```env
VITE_FRONTEND_URL=https://www.holisbotanicals.com
VITE_API_BASE=https://api.holisbotanicals.com
```

---

## Common Tasks

### Add a New Page

1. **Create page component** in `pages/`:
   ```typescript
   // pages/MyPage.tsx
   import { useSeoMeta } from '../hooks/useSeoMeta';
   
   export default function MyPage() {
     useSeoMeta({
       title: 'My Page - Prostanone',
       description: 'Page description',
     });
     
     return <div>My Page Content</div>;
   }
   ```

2. **Add route** in [App.tsx](App.tsx):
   ```typescript
   <Route path="/my-page" element={<MyPage />} />
   ```

3. **Update navigation** if needed in [components/Navbar.tsx](components/Navbar.tsx)

### Modify Product Packages

Edit [lib/constants.ts](lib/constants.ts):

```typescript
export const PACKAGES = [
  {
    id: 'standard',
    name: 'Standard',
    price: 15000,
    // ...
  },
  // ...
];
```

### Add Blog Post

1. Go to `/admin/login`
2. Enter password
3. Click "Create Blog Post"
4. Fill in details and click "Publish"

Or programmatically:

```typescript
const post = {
  id: 'slug-here',
  title: 'Post Title',
  excerpt: 'Short excerpt',
  content: '# Markdown content here',
  date: new Date(),
};

// Save to localStorage via blog storage utility
```

### Update Testimonials

Edit [lib/constants.ts](lib/constants.ts) in the `TESTIMONIALS` array:

```typescript
export const TESTIMONIALS = [
  {
    name: 'John Doe',
    text: 'Testimonial text...',
    image: '/images/john.jpg',
  },
  // ...
];
```

### Customize Styling

1. **Global styles** — [global.css](global.css)
2. **Tailwind config** — Inline in [index.html](index.html)
3. **Component styles** — Use Tailwind classes directly in components

### Add Quiz Question

Edit [lib/constants.ts](lib/constants.ts) in the `QUIZ_QUESTIONS` array:

```typescript
export const QUIZ_QUESTIONS = [
  // ... existing questions
  {
    id: 'new-question',
    question: 'How often do you wake up at night?',
    options: ['Never', 'Rarely', 'Often', 'Very often'],
  },
];
```

---

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
# macOS/Linux
lsof -i :3000
kill -9 <PID>

# Windows (PowerShell)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

Or specify a different port:

```bash
npm run dev -- --port 3001
```

### Tailwind Styles Not Loading

1. Verify Tailwind CDN is in [index.html](index.html)
2. Check browser console for CSP errors
3. Clear browser cache (`Ctrl+Shift+Delete`)
4. Hard reload page (`Ctrl+Shift+R` or `Cmd+Shift+R`)

### Payment Not Working

1. Verify Korapay script is loaded in [index.html](index.html)
2. Check `VITE_KORAPAY_PUBLIC_KEY` is set correctly
3. Verify `window.Korapay` is available in browser console
4. Check network requests in browser DevTools

### Cart/Quiz Data Lost After Refresh

1. Verify localStorage is enabled in browser
2. Check browser console for any storage errors
3. Verify AppContext is properly configured
4. Check Privacy/Incognito mode restrictions

### Tests Failing

```bash
# Clear cache and reinstall
rm -rf node_modules
npm install

# Run tests with verbose output
npm run test -- --reporter=verbose

# Run specific test file
npm run test -- hooks/useCheckout.test.tsx
```

### Build Errors

```bash
# Clear Vite cache
rm -rf dist .vite

# Rebuild
npm run build
```

### TypeScript Errors

```bash
# Type check
npx tsc --noEmit

# Check specific file
npx tsc --noEmit pages/Home.tsx
```

---

## Additional Resources

### Documentation

- [DOCUMENTATION.md](DOCUMENTATION.md) — Detailed technical reference
- [SEO_QUICK_REFERENCE.md](SEO_QUICK_REFERENCE.md) — SEO implementation guide
- [TODO.md](TODO.md) — Known issues and planned features

### External Docs

- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Router](https://reactrouter.com/docs)
- [Framer Motion](https://www.framer.com/motion/introduction/)
- [Vitest](https://vitest.dev/)
- [Korapay Docs](https://docs.korapay.com/)

### Tools & Resources

- [VS Code](https://code.visualstudio.com/) — Code editor
- [GitHub](https://github.com/) — Version control
- [Vercel](https://vercel.com/) — Deployment
- [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/) — Browser extension
- [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/) — State debugging

### Getting Help

- **GitHub Issues** — Report bugs [here](https://github.com/Joesef127/Prostanone---Premium-Prostate-Health/issues)
- **Discussions** — Ask questions [here](https://github.com/Joesef127/Prostanone---Premium-Prostate-Health/discussions)
- **Email** — sales@holisbotanicals.com

---

## License

This project is proprietary and confidential. All rights reserved.

---

## Contributors

- **Holis Botanical Gardens** — Product & brand
- **Development Team** — Code & implementation

---

## Changelog

### Version 1.0.0 (Current)

- ✅ Full e-commerce funnel
- ✅ Interactive quiz system
- ✅ Korapay payment integration
- ✅ Blog system with admin interface
- ✅ Newsletter popup
- ✅ Dark mode support
- ✅ SEO optimization
- ✅ Mobile responsive design
- ✅ Comprehensive testing

### Planned Features

- [ ] User accounts & order history
- [ ] Email verification
- [ ] Inventory management
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Progressive Web App (PWA)

---

## Quick Reference

### Common Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run test` | Run tests (watch) |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Coverage report |

### Key Files

| File | Purpose |
| --- | --- |
| [App.tsx](App.tsx) | Route definitions |
| [context/AppContext.tsx](context/AppContext.tsx) | Global state |
| [lib/constants.ts](lib/constants.ts) | Static data |
| [lib/seo.ts](lib/seo.ts) | SEO utilities |
| [index.html](index.html) | HTML shell & config |
| [vite.config.ts](vite.config.ts) | Build config |

---

**Last Updated:** April 2026  
**Repository:** https://github.com/Joesef127/Prostanone---Premium-Prostate-Health  
**Status:** Active & Maintained ✅
