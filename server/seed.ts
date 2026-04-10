import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { admins, packages, testimonials } from './db/schema';
import { eq } from 'drizzle-orm';

const PACKAGES_SEED = [
  {
    id: 'starter',
    name: 'Starter Pack',
    containers: 1,
    price: 15000,
    originalPrice: 15000,
    description: '1 Pack · 20 Days Supply',
    savingsText: null,
    deliveryText: 'Free delivery within Lagos (except Badagry & Epe)',
    usageNote: 'For best results, use consistently for at least 2 months',
    badge: null,
  },
  {
    id: 'trial-boost',
    name: 'Trial Boost',
    containers: 2,
    price: 25000,
    originalPrice: 30000,
    description: '2 Packs · 40 Days Supply',
    savingsText: 'Save ₦5,000',
    deliveryText: 'Free delivery within Lagos (except Badagry & Epe)',
    usageNote: 'A strong starting point toward visible improvement',
    badge: null,
  },
  {
    id: 'most-valuable',
    name: 'Most Valuable Package',
    containers: 3,
    price: 39000,
    originalPrice: 45000,
    description: '3 Packs · 2 Full Months',
    savingsText: 'Save ₦6,000',
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
    description: '4 Packs · ~3 Months Supply',
    savingsText: 'Save ₦8,000',
    deliveryText: 'Free delivery within Lagos (except Badagry & Epe)',
    usageNote: 'For sustained and stronger results',
    badge: null,
  },
  {
    id: 'performance',
    name: 'Performance Pack',
    containers: 5,
    price: 65000,
    originalPrice: 75000,
    description: '5 Packs · ~4 Months Supply',
    savingsText: 'Save ₦10,000',
    deliveryText: 'Free delivery within Lagos (except Badagry & Epe)',
    usageNote: 'For long-term support and confidence',
    badge: null,
  },
  {
    id: 'loyalty',
    name: 'Loyalty Pack',
    containers: 9,
    price: 115000,
    originalPrice: 135000,
    description: '9 Packs · 6 Full Months',
    savingsText: 'Save ₦20,000',
    deliveryText: 'Free delivery within Lagos (except Badagry & Epe)',
    usageNote: 'Deep, long-term results · Best value per pack',
    badge: 'BEST VALUE',
  },
];

const TESTIMONIALS_SEED = [
  {
    name: 'Chidi A.',
    age: 52,
    location: 'Abuja',
    text: 'I was waking up 4 times every night. After 6 weeks with Prostanone, I sleep through the night. My doctor is impressed.',
    rating: 5,
  },
  {
    name: 'Emeka O.',
    age: 48,
    location: 'Lagos',
    text: 'The weak flow was embarrassing. Now I feel like I\'m in my 30s again. No side effects at all.',
    rating: 5,
  },
  {
    name: 'Adekunle T.',
    age: 55,
    location: 'Ibadan',
    text: 'I tried everything. Prostanone is the only supplement that actually worked. NAFDAC approval gave me confidence.',
    rating: 5,
  },
  {
    name: 'Tunde B.',
    age: 61,
    location: 'Port Harcourt',
    text: 'After 8 weeks, my urgency is gone. I can travel without worrying about finding a toilet.',
    rating: 5,
  },
  {
    name: 'Ibrahim K.',
    age: 49,
    location: 'Kano',
    text: 'My urologist recommended natural supplements first. Prostanone delivered results in 4 weeks.',
    rating: 5,
  },
  {
    name: 'Miss Abiodun',
    age: null,
    location: null,
    text: 'The drug is a wonder drug!!! PSA went from 48 to 8.7, and volume shrunk from 225cc to 72cc... that was a miracle... my dad is super happy about the result.',
    rating: 5,
  },
  {
    name: 'Mr Olu',
    age: null,
    location: null,
    text: 'I was on catheter for months used prostanone for one month and was discharged from the hospital, after using it...',
    rating: 5,
  },
  {
    name: 'Anonymous Patient',
    age: null,
    location: 'Ebonyi',
    text: 'Good evening sir. I was introduced to PROSTANONE herbal capsules but unfortunately when I saw the efficacy of the product I decided to buy on my own. I searched and discovered it was marketed by HOLIS BOTANICAL GARDEN. I am a prostate enlargement patient looking for direct outlets to buy it in Lagos or Ebonyi State.',
    rating: 5,
  },
];

async function seed() {
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL is not set in .env');
    process.exit(1);
  }
  if (!adminEmail || !adminPassword) {
    console.error('ERROR: ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);

  console.log('Seeding testimonials...');
  for (const t of TESTIMONIALS_SEED) {
    await db.insert(testimonials).values(t).onConflictDoNothing();
  }
  console.log(`Seeded ${TESTIMONIALS_SEED.length} testimonials.`);

  console.log('Seeding packages...');
  for (const pkg of PACKAGES_SEED) {
    await db
      .insert(packages)
      .values(pkg)
      .onConflictDoNothing();
  }
  console.log(`Seeded ${PACKAGES_SEED.length} packages.`);

  console.log('Seeding admin account...');
  const existing = await db.select().from(admins).where(eq(admins.email, adminEmail));
  if (existing.length > 0) {
    console.log(`Admin ${adminEmail} already exists — skipping.`);
  } else {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await db.insert(admins).values({ email: adminEmail, passwordHash });
    console.log(`Admin ${adminEmail} created.`);
  }

  console.log('Done.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
