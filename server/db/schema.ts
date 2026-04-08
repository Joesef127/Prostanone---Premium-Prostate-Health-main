import { pgTable, serial, varchar, integer, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const admins = pgTable('admins', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const packages = pgTable('packages', {
  id: varchar('id', { length: 64 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  containers: integer('containers').notNull(),
  price: integer('price').notNull(),
  originalPrice: integer('original_price'),
  description: varchar('description', { length: 255 }).notNull(),
  savingsText: varchar('savings_text', { length: 100 }),
  deliveryText: varchar('delivery_text', { length: 255 }),
  usageNote: varchar('usage_note', { length: 255 }),
  badge: varchar('badge', { length: 50 }),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const blogPosts = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  excerpt: text('excerpt').notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  date: varchar('date', { length: 50 }).notNull(),
  readTime: varchar('read_time', { length: 50 }).notNull(),
  coverImage: varchar('cover_image', { length: 500 }).notNull(),
  content: text('content').notNull(),
  contentType: varchar('content_type', { length: 20 }).default('markdown').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  orderId: varchar('order_id', { length: 20 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  altPhone: varchar('alt_phone', { length: 50 }),
  shippingAddress: text('shipping_address').notNull(),
  notes: text('notes'),
  itemsOrdered: text('items_ordered').notNull(),
  deliveryFee: integer('delivery_fee').notNull().default(0),
  totalAmount: integer('total_amount').notNull(),
  paymentMethod: varchar('payment_method', { length: 100 }),
  paymentReference: varchar('payment_reference', { length: 100 }),
  paymentStatus: varchar('payment_status', { length: 50 }),
  checkoutStep: varchar('checkout_step', { length: 50 }),
  reminderSent: boolean('reminder_sent').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const distributors = pgTable('distributors', {
  id: serial('id').primaryKey(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  state: varchar('state', { length: 100 }).notNull(),
  businessType: varchar('business_type', { length: 100 }),
  expectedMonthlyOrder: varchar('expected_monthly_order', { length: 100 }),
  message: text('message'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const contactMessages = pgTable('contact_messages', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
