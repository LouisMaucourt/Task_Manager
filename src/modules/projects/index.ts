import Elysia, { t } from "elysia";
import { auth } from "@/lib/auth";
import { ProjectModel } from "./model";
import * as ProjectService from "./service";

export const project = new Elysia({ prefix: "/projects" })
	.resolve(async ({ request, cookie, status }) => {
		const session = await auth.api.getSession({
			headers: request.headers,
		});

		if (!session) return status(401, "Non authentifié");

		const workspaceId =
			cookie.workspaceId.value ??
			(await ProjectService.getDefaultWorkspaceId(session.user.id));

		if (!workspaceId) return status(400, "Aucun workspace");

		if (!cookie.workspaceId.value) {
			cookie.workspaceId.set({
				value: workspaceId,
				path: "/",
				sameSite: "lax",
				httpOnly: false,
				secure: process.env.NODE_ENV === "production",
				maxAge: 60 * 60 * 24 * 365,
			});
		}

		return { user: session.user, workspaceId: workspaceId as string };
	})
	.get("/", ({ workspaceId }) => ProjectService.getProject(workspaceId), {
		response: {
			200: t.Array(ProjectModel.createResponse),
		},
	})
	.post(
		"/",
		({ body, workspaceId, user }) =>
			ProjectService.createProject(body, workspaceId, user.id),
		{
			body: ProjectModel.createBody,
			response: {
				200: ProjectModel.createResponse,
			},
		},
	)
	.patch(
		"/:id",
		async ({ params, body, workspaceId, status }) => {
			const project = await ProjectService.updateProject(
				params.id,
				body,
				workspaceId,
			);

			return project ?? status(404, "Project not found");
		},
		{
			params: ProjectModel.params,
			body: ProjectModel.updateBody,
			response: {
				200: ProjectModel.createResponse,
				404: t.String(),
			},
		},
	)
	.delete(
		"/:id",
		async ({ params, workspaceId, status }) => {
			const project = await ProjectService.deleteProject(
				params.id,
				workspaceId,
			);

			return project ?? status(404, "Project not found");
		},
		{
			params: ProjectModel.params,
			response: {
				200: ProjectModel.createResponse,
				404: t.String(),
			},
		},
	);
