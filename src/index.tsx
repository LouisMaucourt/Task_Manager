import { Elysia } from "elysia";

import index from "./index.html";
import { auth } from "./lib/auth";
import { boards } from "./modules/boards";
import { boardsList } from "./modules/boardsList";
import { project } from "./modules/projects";
import { users } from "./modules/users";
import { workspaces } from "./modules/workspaces";

const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"];

const api = new Elysia({ prefix: "/api" })
	.all("/auth/*", ({ request, status }) => {
		if (BETTER_AUTH_ACCEPT_METHODS.includes(request.method)) {
			return auth.handler(request);
		}
		return status(405);
	})
	.get("/test", () => ({ message: "test" }))
	.use(users)
	.use(workspaces)
	.use(project)
	.use(boards)
	.use(boardsList);

Bun.serve({
	routes: {
		"/api/*": (req) => api.handle(req),
		"/*": index,
	},
	development: true,
});
console.log("🚀 Server running at http://localhost:3000");
