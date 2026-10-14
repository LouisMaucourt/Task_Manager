import { Elysia, t } from "elysia";
import { auth } from "../../lib/auth";
import { WorkspaceModel } from "./model";
import * as WorkspaceService from "./service";

export const workspaces = new Elysia({ prefix: "/workspace" })
	.resolve(async ({ request, status }) => {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session) return status(401, "Non authentifié");

		return { user: session.user };
	})
	.get("/", ({ user }) => WorkspaceService.getWorkspaces(user.id), {
		response: { 200: t.Array(WorkspaceModel.createResponse) },
	})
	.post(
		"/",
		({ body, user }) => WorkspaceService.createWorkspace(body, user.id),
		{
			body: WorkspaceModel.createBody,
			response: { 200: WorkspaceModel.createResponse },
		},
	)
	.patch(
		"/:id",
		async ({ params, body, user, status }) => {
			const workspace = await WorkspaceService.updateWorkspace(
				params.id,
				body,
				user.id,
			);
			return workspace ?? status(404, "Workspace not found");
		},
		{
			params: WorkspaceModel.params,
			body: WorkspaceModel.updateBody,
			response: { 200: WorkspaceModel.createResponse, 404: t.String() },
		},
	)
	.delete(
		"/:id",
		async ({ params, user, status }) => {
			const workspace = await WorkspaceService.deleteWorkspace(
				params.id,
				user.id,
			);
			return workspace ?? status(404, "Workspace not found");
		},
		{
			params: WorkspaceModel.params,
			response: { 200: WorkspaceModel.createResponse, 404: t.String() },
		},
	);
