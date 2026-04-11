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

const allowedOrigins = [
  "http://localhost:3000",
  "https://prostanone.vercel.app",
  "https://prostanone-dev.vercel.app",
  "https://www.holisbotanicals.com",
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
];

app.use(
  "*",
  cors({
    origin: (origin) =>
      allowedOrigins.includes(origin) ? origin : allowedOrigins[1],
    credentials: true,
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
