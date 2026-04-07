import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "@hono/node-server/vercel";
import auth from "../server/routes/auth";
import packagesRoute from "../server/routes/packages";
import blog from "../server/routes/blog";
import data from "../server/routes/data";

const app = new Hono().basePath("/api");

app.onError((err, c) => {
  console.error("[unhandled]", err);
  return c.json({ error: "Internal server error" }, 500);
});

app.use(
  "*",
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? [
            "https://prostanone-premium-prostate-heal-git-b1d987-joesef127s-projects.vercel.app",
            "https://prostanone-premium-prostate-health.vercel.app",
            "https://prostanone.vercel.app"
          ]
        : ["http://localhost:3000"],
    credentials: true,
  }),
);

app.route("/auth", auth);
app.route("/packages", packagesRoute);
app.route("/blog", blog);
app.route("/", data);

export default handle(app);
