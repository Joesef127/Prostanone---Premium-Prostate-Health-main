import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import auth from "./routes/auth";
import packagesRoute from "./routes/packages";
import blog from "./routes/blog";
import data from "./routes/data";
import testimonialsRoute from "./routes/testimonials";

const app = new Hono().basePath("/api");

app.onError((err, c) => {
  console.error("[unhandled]", err);
  return c.json({ error: "Internal server error" }, 500);
});

const configuredAllowedOrigins = (process.env.CORS_ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = Array.from(
  new Set([
    ...configuredAllowedOrigins,
    ...(process.env.VITE_FRONTEND_URL ? [process.env.VITE_FRONTEND_URL] : []),
  ]),
);
const fallbackOrigin = allowedOrigins[0] ?? "";

app.use(
  "*",
  cors({
    origin: (origin) =>
      allowedOrigins.includes(origin) ? origin : fallbackOrigin,
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Set-Cookie"],
  }),
);

app.route("/auth", auth);
app.route("/packages", packagesRoute);
app.route("/testimonials", testimonialsRoute);
app.route("/blog", blog);
app.route("/", data);

const port = Number(process.env.PORT) || 8080;
serve({ fetch: app.fetch, port }, () => {
  console.log(`API server running on port ${port}`);
});
