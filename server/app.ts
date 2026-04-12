import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "@hono/node-server/vercel";
import auth from "./routes/auth";
import packagesRoute from "./routes/packages";
import blog from "./routes/blog";
import data from "./routes/data";
import seo from "./routes/seo";

const app = new Hono().basePath("/api");

app.onError((err, c) => {
  console.error("[unhandled]", err);
  return c.json({ error: "Internal server error" }, 500);
});

// Build allowed CORS origins from environment configuration
const configuredAllowedOrigins = (process.env.CORS_ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = Array.from(
  new Set([
    ...configuredAllowedOrigins,
    ...(process.env.VITE_FRONTEND_URL ? [process.env.VITE_FRONTEND_URL] : []),
    // Development fallback
    ...(process.env.NODE_ENV !== "production" ? ["http://localhost:3000"] : []),
  ]),
);

app.use(
  "*",
  cors({
    origin: (origin) =>
      allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
    credentials: true,
  }),
);

app.route("/auth", auth);
app.route("/packages", packagesRoute);
app.route("/blog", blog);
app.route("/seo", seo);
app.route("/", data);

export default handle(app);
