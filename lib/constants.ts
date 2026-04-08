import { ProductPackage, QuizQuestion, Testimonial } from '../types';

// API base URL — empty string means relative (works in dev via Vite proxy)
// Set API_URL in Vercel env vars to your Render backend URL e.g. https://prostanone-api.onrender.com
declare const __API_URL__: string;
export const API_BASE: string = typeof __API_URL__ !== 'undefined' ? __API_URL__ : '';

// NAFDAC Registration Number — update here to change across the entire site
export const NAFDAC_REG_NO = 'A7-4976L';

// Pricing
export const PACKAGES: ProductPackage[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    containers: 1,
    price: 15000,
    originalPrice: 15000,
    description: '1 Pack · 20 Days Supply',
    deliveryText: 'Free delivery within Lagos (except Badagry & Epe)',
    usageNote: 'For best results, use consistently for at least 2 months',
  },
  {
    id: 'trial-boost',
    name: 'Trial Boost',
    containers: 2,
    price: 25000,
    originalPrice: 30000,
    savingsText: 'Save ₦5,000',
    description: '2 Packs · 40 Days Supply',
    deliveryText: 'Free delivery within Lagos (except Badagry & Epe)',
    usageNote: 'A strong starting point toward visible improvement',
  },
  {
    id: 'most-valuable',
    name: 'Most Valuable Package',
    containers: 3,
    price: 39000,
    originalPrice: 45000,
    savingsText: 'Save ₦6,000',
    description: '3 Packs · 2 Full Months',
    deliveryText: 'Free delivery within Lagos (except Badagry & Epe)',
    usageNote: 'Full consistency for noticeable improvement',
    badge: 'RECOMMENDED',
  },
  {
    id: 'consistency',
    name: 'Consistency Pack',
    containers: 4,
    price: 52000,
    originalPrice: 60000,
    savingsText: 'Save ₦8,000',
    description: '4 Packs · ~3 Months Supply',
    deliveryText: 'Free delivery within Lagos (except Badagry & Epe)',
    usageNote: 'For sustained and stronger results',
  },
  {
    id: 'performance',
    name: 'Performance Pack',
    containers: 5,
    price: 65000,
    originalPrice: 75000,
    savingsText: 'Save ₦10,000',
    description: '5 Packs · ~4 Months Supply',
    deliveryText: 'Free delivery within Lagos (except Badagry & Epe)',
    usageNote: 'For long-term support and confidence',
  },
  {
    id: 'loyalty',
    name: 'Loyalty Pack',
    containers: 9,
    price: 115000,
    originalPrice: 135000,
    savingsText: 'Save ₦20,000',
    description: '9 Packs · 6 Full Months',
    deliveryText: 'Free delivery within Lagos (except Badagry & Epe)',
    usageNote: 'Deep, long-term results · Best value per pack',
    badge: 'BEST VALUE',
  },
];

export const SMALL_PRINT = [
  "✔ NAFDAC Certified",
  "✔ 100% Natural Herbal Formula",
  "✔ Distributed by Holis Botanical Gardens",
  "✔ Nationwide Delivery Available",
  "✔ Free Delivery on Option D & E Only",
  "✔ Pay via Bank Transfer or Card",
];

// Testimonials
export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Chidi A.",
    age: 52,
    location: "Abuja",
    text: "I was waking up 4 times every night. After 6 weeks with Prostanone, I sleep through the night. My doctor is impressed.",
    rating: 5
  },
  {
    id: 2,
    name: "Emeka O.",
    age: 48,
    location: "Lagos",
    text: "The weak flow was embarrassing. Now I feel like I'm in my 30s again. No side effects at all.",
    rating: 5
  },
  {
    id: 3,
    name: "Adekunle T.",
    age: 55,
    location: "Ibadan",
    text: "I tried everything. Prostanone is the only supplement that actually worked. NAFDAC approval gave me confidence.",
    rating: 5
  },
  {
    id: 4,
    name: "Tunde B.",
    age: 61,
    location: "Port Harcourt",
    text: "After 8 weeks, my urgency is gone. I can travel without worrying about finding a toilet.",
    rating: 5
  },
  {
    id: 5,
    name: "Ibrahim K.",
    age: 49,
    location: "Kano",
    text: "My urologist recommended natural supplements first. Prostanone delivered results in 4 weeks.",
    rating: 5
  },
  {
    id: 6,
    name: "Miss Abiodun",
    age: null,
    location: null,
    text: "The drug is a wonder drug!!! PSA went from 48 to 8.7, and volume shrunk from 225cc to 72cc... that was a miracle... my dad is super happy about the result.",
    rating: 5
  },
  {
    id: 7,
    name: "Mr Olu",
    age: null,
    location: null,
    text: "I was on catheter for months used prostanone for one month and was discharged from the hospital, after using it...",
    rating: 5
  },
  {
    id: 8,
    name: "Anonymous Patient",
    age: null,
    location: "Ebonyi",
    text: "Good evening sir. I was introduced to PROSTANONE herbal capsules but unfortunately when I saw the efficacy of the product I decided to buy on my own. I searched and discovered it was marketed by HOLIS BOTANICAL GARDEN. I am a prostate enlargement patient looking for direct outlets to buy it in Lagos or Ebonyi State.",
    rating: 5
  }
];

// Quiz Questions
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    text: "How old are you?",
    options: [
      { text: "Under 40", score: 0 },
      { text: "40-49", score: 1 },
      { text: "50-59", score: 2 },
      { text: "60-69", score: 3 },
      { text: "70+", score: 4 }
    ]
  },
  {
    id: 2,
    text: "How often do you wake up at night to urinate?",
    options: [
      { text: "Never", score: 0 },
      { text: "Once per night", score: 1 },
      { text: "2 times per night", score: 3 },
      { text: "3-4 times per night", score: 4 },
      { text: "5+ times per night", score: 5 }
    ]
  },
  {
    id: 3,
    text: "How often do you have difficulty starting urination?",
    options: [
      { text: "Never", score: 0 },
      { text: "Rarely", score: 1 },
      { text: "Sometimes", score: 3 },
      { text: "Often", score: 4 },
      { text: "Always", score: 5 }
    ]
  },
  {
    id: 4,
    text: "How often do you feel your bladder is not completely empty after urinating?",
    options: [
      { text: "Never", score: 0 },
      { text: "Rarely", score: 1 },
      { text: "Sometimes", score: 3 },
      { text: "Often", score: 4 },
      { text: "Always", score: 5 }
    ]
  },
  {
    id: 5,
    text: "How would you describe your urine stream?",
    options: [
      { text: "Strong and steady", score: 0 },
      { text: "Slightly weak", score: 1 },
      { text: "Moderately weak", score: 3 },
      { text: "Very weak", score: 4 },
      { text: "Stops and starts", score: 5 }
    ]
  },
  {
    id: 6,
    text: "How often do you experience sudden urgent need to urinate?",
    options: [
      { text: "Never", score: 0 },
      { text: "Rarely", score: 1 },
      { text: "Sometimes", score: 3 },
      { text: "Often", score: 4 },
      { text: "Always", score: 5 }
    ]
  },
  {
    id: 7,
    text: "How much do these symptoms affect your quality of life?",
    options: [
      { text: "Not at all", score: 0 },
      { text: "A little bit", score: 1 },
      { text: "Moderately", score: 3 },
      { text: "Quite a bit", score: 4 },
      { text: "Severely", score: 5 }
    ]
  }
];

export const NAV_LINKS = [
  { label: 'Product', path: '/product' },
  { label: 'About', path: '/about' },
  { label: 'Science', path: '/science' },
  { label: 'Blog', path: '/blog' },
  { label: 'Reviews', path: '/reviews' },
  { label: 'Contact', path: '/contact' },
];

export const BUSINESS_TYPES = [
  'Online Retailer',
  'Physical Store / Pharmacy',
  'Clinic / Hospital',
  'Supermarket / Superstore',
  'Market Trader',
  'Door-to-Door Sales',
  'Other',
];

export const MONTHLY_ORDER_QUANTITIES = [
  '1–5 packs',
  '6–10 packs',
  '11–20 packs',
  '21–50 packs',
  '50+ packs',
];

export const FAQS = [
  {
    question: "What is Prostanone?",
    answer: "Prostanone is a NAFDAC-certified herbal supplement combining saw palmetto, chimaphila umbellata, pareira brava, and hydrangea arborescens to support healthy prostate function and urinary comfort."
  },
  {
    question: "How does it work?",
    answer: "Prostanone blocks 5-alpha reductase enzyme, stopping testosterone conversion to DHT. This arrests unnecessary prostate growth while reducing inflammation and improving urinary flow."
  },
  {
    question: "How long before I see results?",
    answer: "Most users report noticeable improvement within 4-6 weeks. For optimal results, use consistently for 8-12 weeks."
  },
  {
    question: "Are there side effects?",
    answer: "Prostanone is made from natural herbal ingredients with no reported side effects. Consult your doctor if you have existing medical conditions."
  },
  {
    question: "Can I take it with other medications?",
    answer: "Prostanone has no known drug interactions, but always consult your healthcare provider before combining supplements with prescription medications."
  },
  {
    question: "What's the dosage?",
    answer: "Take Prostanone 3 times daily,  morning, afternoon, and night or as directed by your healthcare professional. Do not exceed the recommended dosage."
  },
  {
    question: "Is it NAFDAC approved?",
    answer: "Yes. Prostanone is fully NAFDAC-certified and manufactured in GMP-compliant facilities."
  },
  {
    question: "Do you ship nationwide?",
    answer: "Yes, we ship to all 36 Nigerian states. Lagos delivery: 1-2 days. Other states: 3-5 days."
  }
];

