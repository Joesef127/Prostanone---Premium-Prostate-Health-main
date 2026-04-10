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

// Build allowed CORS origins
const getCorsOrigins = (): string[] => {
  if (process.env.NODE_ENV === "production") {
    const origins: string[] = [
      "https://prostanone-premium-prostate-heal-git-b1d987-joesef127s-projects.vercel.app",
      "https://prostanone-premium-prostate-health.vercel.app",
      "https://prostanone.vercel.app",
    ];
    // Add FRONTEND_URL if provided in environment
    if (process.env.FRONTEND_URL && !origins.includes(process.env.FRONTEND_URL)) {
      origins.push(process.env.FRONTEND_URL);
    }
    return origins;
  }
  return ["http://localhost:3000"];
};

app.use(
  "*",
  cors({
    origin: getCorsOrigins(),
    credentials: true,
  }),
);

app.route("/auth", auth);
app.route("/packages", packagesRoute);
app.route("/blog", blog);
app.route("/seo", seo);
app.route("/", data);

export default handle(app);
