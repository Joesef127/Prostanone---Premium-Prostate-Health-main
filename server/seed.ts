import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { admins, packages } from './db/schema';
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
