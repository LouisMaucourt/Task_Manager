import { Elysia } from "elysia";
import index from "./index.html";

const api = new Elysia({ prefix: "/api" })
  .get("/test", () => ({ message: "test" }));

Bun.serve({
  routes: {
    "/api/*": (req) => api.handle(req),
    "/*": index,
  },
  development: true,
});

console.log("🚀 Server running at http://localhost:3000");