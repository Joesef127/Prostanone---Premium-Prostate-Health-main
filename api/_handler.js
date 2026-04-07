var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server/app.ts
var app_exports = {};
__export(app_exports, {
  default: () => app_default
});
module.exports = __toCommonJS(app_exports);
var import_hono5 = require("hono");
var import_cors = require("hono/cors");
var import_vercel = require("@hono/node-server/vercel");

// server/routes/auth.ts
var import_hono = require("hono");
var import_cookie2 = require("hono/cookie");
var import_bcryptjs = __toESM(require("bcryptjs"), 1);
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"), 1);

// server/db/index.ts
var import_serverless = require("@neondatabase/serverless");
var import_neon_http = require("drizzle-orm/neon-http");

// server/db/schema.ts
var schema_exports = {};
__export(schema_exports, {
  admins: () => admins,
  blogPosts: () => blogPosts,
  contactMessages: () => contactMessages,
  distributors: () => distributors,
  newsletterSubscribers: () => newsletterSubscribers,
  orders: () => orders,
  packages: () => packages
});
var import_pg_core = require("drizzle-orm/pg-core");
var admins = (0, import_pg_core.pgTable)("admins", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  email: (0, import_pg_core.varchar)("email", { length: 255 }).notNull().unique(),
  passwordHash: (0, import_pg_core.varchar)("password_hash", { length: 255 }).notNull(),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow().notNull()
});
var packages = (0, import_pg_core.pgTable)("packages", {
  id: (0, import_pg_core.varchar)("id", { length: 64 }).primaryKey(),
  name: (0, import_pg_core.varchar)("name", { length: 255 }).notNull(),
  containers: (0, import_pg_core.integer)("containers").notNull(),
  price: (0, import_pg_core.integer)("price").notNull(),
  originalPrice: (0, import_pg_core.integer)("original_price"),
  description: (0, import_pg_core.varchar)("description", { length: 255 }).notNull(),
  savingsText: (0, import_pg_core.varchar)("savings_text", { length: 100 }),
  deliveryText: (0, import_pg_core.varchar)("delivery_text", { length: 255 }),
  usageNote: (0, import_pg_core.varchar)("usage_note", { length: 255 }),
  badge: (0, import_pg_core.varchar)("badge", { length: 50 }),
  updatedAt: (0, import_pg_core.timestamp)("updated_at").defaultNow().notNull()
});
var blogPosts = (0, import_pg_core.pgTable)("blog_posts", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  slug: (0, import_pg_core.varchar)("slug", { length: 255 }).notNull().unique(),
  title: (0, import_pg_core.varchar)("title", { length: 255 }).notNull(),
  excerpt: (0, import_pg_core.text)("excerpt").notNull(),
  category: (0, import_pg_core.varchar)("category", { length: 100 }).notNull(),
  date: (0, import_pg_core.varchar)("date", { length: 50 }).notNull(),
  readTime: (0, import_pg_core.varchar)("read_time", { length: 50 }).notNull(),
  coverImage: (0, import_pg_core.varchar)("cover_image", { length: 500 }).notNull(),
  content: (0, import_pg_core.text)("content").notNull(),
  contentType: (0, import_pg_core.varchar)("content_type", { length: 20 }).default("markdown").notNull(),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow().notNull(),
  updatedAt: (0, import_pg_core.timestamp)("updated_at").defaultNow().notNull()
});
var newsletterSubscribers = (0, import_pg_core.pgTable)("newsletter_subscribers", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  email: (0, import_pg_core.varchar)("email", { length: 255 }).notNull().unique(),
  name: (0, import_pg_core.varchar)("name", { length: 255 }),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow().notNull()
});
var orders = (0, import_pg_core.pgTable)("orders", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  name: (0, import_pg_core.varchar)("name", { length: 255 }).notNull(),
  email: (0, import_pg_core.varchar)("email", { length: 255 }).notNull(),
  phone: (0, import_pg_core.varchar)("phone", { length: 50 }).notNull(),
  altPhone: (0, import_pg_core.varchar)("alt_phone", { length: 50 }),
  shippingAddress: (0, import_pg_core.text)("shipping_address").notNull(),
  notes: (0, import_pg_core.text)("notes"),
  itemsOrdered: (0, import_pg_core.text)("items_ordered").notNull(),
  deliveryFee: (0, import_pg_core.integer)("delivery_fee").notNull().default(0),
  totalAmount: (0, import_pg_core.integer)("total_amount").notNull(),
  paymentMethod: (0, import_pg_core.varchar)("payment_method", { length: 100 }),
  paymentReference: (0, import_pg_core.varchar)("payment_reference", { length: 100 }),
  paymentStatus: (0, import_pg_core.varchar)("payment_status", { length: 50 }),
  checkoutStep: (0, import_pg_core.varchar)("checkout_step", { length: 50 }),
  reminderSent: (0, import_pg_core.boolean)("reminder_sent").default(false),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow().notNull()
});
var distributors = (0, import_pg_core.pgTable)("distributors", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  fullName: (0, import_pg_core.varchar)("full_name", { length: 255 }).notNull(),
  phone: (0, import_pg_core.varchar)("phone", { length: 50 }).notNull(),
  email: (0, import_pg_core.varchar)("email", { length: 255 }).notNull(),
  state: (0, import_pg_core.varchar)("state", { length: 100 }).notNull(),
  businessType: (0, import_pg_core.varchar)("business_type", { length: 100 }),
  expectedMonthlyOrder: (0, import_pg_core.varchar)("expected_monthly_order", { length: 100 }),
  message: (0, import_pg_core.text)("message"),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow().notNull()
});
var contactMessages = (0, import_pg_core.pgTable)("contact_messages", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  name: (0, import_pg_core.varchar)("name", { length: 255 }).notNull(),
  email: (0, import_pg_core.varchar)("email", { length: 255 }).notNull(),
  message: (0, import_pg_core.text)("message").notNull(),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow().notNull()
});

// server/db/index.ts
var _db = null;
function getDb() {
  if (_db) return _db;
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  const sql = (0, import_serverless.neon)(databaseUrl);
  _db = (0, import_neon_http.drizzle)(sql, { schema: schema_exports });
  return _db;
}
var db = new Proxy({}, {
  get(_target, prop) {
    return getDb()[prop];
  }
});

// server/routes/auth.ts
var import_drizzle_orm = require("drizzle-orm");

// server/middleware/auth.ts
var import_cookie = require("hono/cookie");
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
async function requireAdmin(c, next) {
  const token = (0, import_cookie.getCookie)(c, "admin_token");
  if (!token) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  try {
    const payload = import_jsonwebtoken.default.verify(token, process.env.JWT_SECRET);
    c.set("admin", payload);
    await next();
  } catch {
    return c.json({ error: "Invalid or expired session" }, 401);
  }
}

// server/routes/auth.ts
var auth = new import_hono.Hono();
auth.post("/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }
    const [admin] = await db.select().from(admins).where((0, import_drizzle_orm.eq)(admins.email, email.toLowerCase().trim()));
    if (!admin) {
      return c.json({ error: "Invalid credentials" }, 401);
    }
    const valid = await import_bcryptjs.default.compare(password, admin.passwordHash);
    if (!valid) {
      return c.json({ error: "Invalid credentials" }, 401);
    }
    const token = import_jsonwebtoken2.default.sign(
      { adminId: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    (0, import_cookie2.setCookie)(c, "admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 60 * 60 * 24 * 7,
      // 7 days
      path: "/"
    });
    return c.json({ success: true, email: admin.email });
  } catch (err) {
    console.error("[/api/auth/login]", err);
    return c.json({ error: "Internal server error" }, 500);
  }
});
auth.post("/logout", (c) => {
  (0, import_cookie2.deleteCookie)(c, "admin_token", { path: "/" });
  return c.json({ success: true });
});
auth.get("/me", requireAdmin, (c) => {
  const admin = c.get("admin");
  return c.json({ email: admin.email });
});
var auth_default = auth;

// server/routes/packages.ts
var import_hono2 = require("hono");
var import_drizzle_orm2 = require("drizzle-orm");
var packagesRoute = new import_hono2.Hono();
packagesRoute.get("/", async (c) => {
  const rows = await db.select().from(packages).orderBy(packages.price);
  return c.json(rows);
});
packagesRoute.put("/:id", requireAdmin, async (c) => {
  const id = c.req.param("id");
  if (!id) return c.json({ error: "Missing id" }, 400);
  const body = await c.req.json();
  const allowedFields = {};
  if (body.name !== void 0) allowedFields.name = body.name;
  if (body.price !== void 0) allowedFields.price = body.price;
  if (body.originalPrice !== void 0) allowedFields.originalPrice = body.originalPrice;
  if (body.description !== void 0) allowedFields.description = body.description;
  if (body.savingsText !== void 0) allowedFields.savingsText = body.savingsText;
  if (body.deliveryText !== void 0) allowedFields.deliveryText = body.deliveryText;
  if (body.usageNote !== void 0) allowedFields.usageNote = body.usageNote;
  if (body.badge !== void 0) allowedFields.badge = body.badge;
  allowedFields.updatedAt = /* @__PURE__ */ new Date();
  const updated = await db.update(packages).set(allowedFields).where((0, import_drizzle_orm2.eq)(packages.id, id)).returning();
  if (updated.length === 0) {
    return c.json({ error: "Package not found" }, 404);
  }
  return c.json(updated[0]);
});
var packages_default = packagesRoute;

// server/routes/blog.ts
var import_hono3 = require("hono");
var import_drizzle_orm3 = require("drizzle-orm");
var blog = new import_hono3.Hono();
blog.get("/", async (c) => {
  const posts = await db.select().from(blogPosts).orderBy(blogPosts.createdAt);
  return c.json(posts);
});
blog.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  if (!slug) return c.json({ error: "Missing slug" }, 400);
  const [post] = await db.select().from(blogPosts).where((0, import_drizzle_orm3.eq)(blogPosts.slug, slug));
  if (!post) return c.json({ error: "Not found" }, 404);
  return c.json(post);
});
blog.post("/", requireAdmin, async (c) => {
  const body = await c.req.json();
  const [created] = await db.insert(blogPosts).values({
    slug: body.slug,
    title: body.title,
    excerpt: body.excerpt,
    category: body.category,
    date: body.date,
    readTime: body.readTime,
    coverImage: body.coverImage,
    content: body.content,
    contentType: body.contentType ?? "markdown"
  }).returning();
  return c.json(created, 201);
});
blog.put("/:slug", requireAdmin, async (c) => {
  const slug = c.req.param("slug");
  if (!slug) return c.json({ error: "Missing slug" }, 400);
  const body = await c.req.json();
  const updated = await db.update(blogPosts).set({ ...body, updatedAt: /* @__PURE__ */ new Date() }).where((0, import_drizzle_orm3.eq)(blogPosts.slug, slug)).returning();
  if (updated.length === 0) return c.json({ error: "Not found" }, 404);
  return c.json(updated[0]);
});
blog.delete("/:slug", requireAdmin, async (c) => {
  const slug = c.req.param("slug");
  if (!slug) return c.json({ error: "Missing slug" }, 400);
  const deleted = await db.delete(blogPosts).where((0, import_drizzle_orm3.eq)(blogPosts.slug, slug)).returning();
  if (deleted.length === 0) return c.json({ error: "Not found" }, 404);
  return c.json({ success: true });
});
var blog_default = blog;

// server/routes/data.ts
var import_hono4 = require("hono");
var import_drizzle_orm4 = require("drizzle-orm");
var data = new import_hono4.Hono();
data.post("/orders", async (c) => {
  const body = await c.req.json();
  const [created] = await db.insert(orders).values({
    name: body.name,
    email: body.email,
    phone: body.phone,
    altPhone: body.altPhone,
    shippingAddress: body.shippingAddress,
    notes: body.notes,
    itemsOrdered: body.itemsOrdered,
    deliveryFee: body.deliveryFee ?? 0,
    totalAmount: body.totalAmount ?? 0,
    paymentMethod: body.paymentMethod,
    paymentReference: body.paymentReference,
    paymentStatus: body.paymentStatus,
    checkoutStep: body.checkoutStep
  }).returning();
  return c.json(created, 201);
});
data.get("/orders", requireAdmin, async (c) => {
  const rows = await db.select().from(orders).orderBy(orders.createdAt);
  return c.json(rows);
});
data.delete("/orders", requireAdmin, async (c) => {
  const body = await c.req.json().catch(() => ({ ids: void 0 }));
  if (body.ids && body.ids.length > 0) {
    await db.delete(orders).where((0, import_drizzle_orm4.inArray)(orders.id, body.ids));
  } else {
    await db.delete(orders);
  }
  return c.json({ success: true });
});
data.post("/distributors", async (c) => {
  const body = await c.req.json();
  const [created] = await db.insert(distributors).values({
    fullName: body.fullName,
    phone: body.phone,
    email: body.email,
    state: body.state,
    businessType: body.businessType,
    expectedMonthlyOrder: body.expectedMonthlyOrder,
    message: body.message
  }).returning();
  return c.json(created, 201);
});
data.get("/distributors", requireAdmin, async (c) => {
  const rows = await db.select().from(distributors).orderBy(distributors.createdAt);
  return c.json(rows);
});
data.delete("/distributors", requireAdmin, async (c) => {
  const body = await c.req.json().catch(() => ({ ids: void 0 }));
  if (body.ids && body.ids.length > 0) {
    await db.delete(distributors).where((0, import_drizzle_orm4.inArray)(distributors.id, body.ids));
  } else {
    await db.delete(distributors);
  }
  return c.json({ success: true });
});
data.post("/subscribers", async (c) => {
  const body = await c.req.json();
  if (!body.email) return c.json({ error: "Email is required" }, 400);
  const [created] = await db.insert(newsletterSubscribers).values({ email: body.email.toLowerCase().trim(), name: body.name }).onConflictDoNothing().returning();
  return c.json({ success: true, created: !!created });
});
data.get("/subscribers", requireAdmin, async (c) => {
  const rows = await db.select().from(newsletterSubscribers).orderBy(newsletterSubscribers.createdAt);
  return c.json(rows);
});
data.delete("/subscribers", requireAdmin, async (c) => {
  const body = await c.req.json().catch(() => ({ ids: void 0 }));
  if (body.ids && body.ids.length > 0) {
    await db.delete(newsletterSubscribers).where((0, import_drizzle_orm4.inArray)(newsletterSubscribers.id, body.ids));
  } else {
    await db.delete(newsletterSubscribers);
  }
  return c.json({ success: true });
});
data.post("/contacts", async (c) => {
  const body = await c.req.json();
  if (!body.name || !body.email || !body.message) return c.json({ error: "All fields required" }, 400);
  const [created] = await db.insert(contactMessages).values({
    name: body.name.trim(),
    email: body.email.trim().toLowerCase(),
    message: body.message.trim()
  }).returning();
  return c.json(created, 201);
});
data.get("/contacts", requireAdmin, async (c) => {
  const rows = await db.select().from(contactMessages).orderBy(contactMessages.createdAt);
  return c.json(rows);
});
data.delete("/contacts", requireAdmin, async (c) => {
  const body = await c.req.json().catch(() => ({ ids: void 0 }));
  if (body.ids && body.ids.length > 0) {
    await db.delete(contactMessages).where((0, import_drizzle_orm4.inArray)(contactMessages.id, body.ids));
  } else {
    await db.delete(contactMessages);
  }
  return c.json({ success: true });
});
data.get("/stats", requireAdmin, async (c) => {
  const [o, d, s, cm] = await Promise.all([
    db.select().from(orders),
    db.select().from(distributors),
    db.select().from(newsletterSubscribers),
    db.select().from(contactMessages)
  ]);
  const paidOrders = o.filter(
    (order) => order.paymentStatus === "success" || order.paymentStatus === "completed" || order.paymentStatus === "paid" || order.paymentMethod === "Cash on Delivery (COD)"
  );
  return c.json({
    orders: o.length,
    paidOrders: paidOrders.length,
    distributors: d.length,
    subscribers: s.length,
    contacts: cm.length
  });
});
var data_default = data;

// server/app.ts
var app = new import_hono5.Hono().basePath("/api");
app.onError((err, c) => {
  console.error("[unhandled]", err);
  return c.json({ error: "Internal server error" }, 500);
});
app.use(
  "*",
  (0, import_cors.cors)({
    origin: process.env.NODE_ENV === "production" ? [
      "https://prostanone-premium-prostate-heal-git-b1d987-joesef127s-projects.vercel.app",
      "https://prostanone-premium-prostate-health.vercel.app",
      "https://prostanone.vercel.app"
    ] : ["http://localhost:3000"],
    credentials: true
  })
);
app.route("/auth", auth_default);
app.route("/packages", packages_default);
app.route("/blog", blog_default);
app.route("/", data_default);
var app_default = (0, import_vercel.handle)(app);
