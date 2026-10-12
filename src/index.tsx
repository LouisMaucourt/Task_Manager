import { Elysia } from "elysia";

import index from "./index.html";
import { auth } from "./lib/auth";
import { users } from "./modules/users";

const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"];

const api = new Elysia({ prefix: "/api" })
	.all("/auth/*", ({ request, status }) => {
		if (BETTER_AUTH_ACCEPT_METHODS.includes(request.method)) {
			return auth.handler(request);
		}
		return status(405);
	})
	.get("/test", () => ({ message: "test" }))
	.use(users);

Bun.serve({
	routes: {
		"/api/*": (req) => api.handle(req),
		"/*": index,
	},
	development: true,
});
console.log("🚀 Server running at http://localhost:3000");
