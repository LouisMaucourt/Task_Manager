import { Elysia, t } from "elysia";
import { auth } from "../../lib/auth";
import { WorkspaceMembersModel } from "./model";
import * as WorkspaceService from "./service";

export const workspacesMembers = new Elysia({ prefix: "/workspacemembers" })
	.resolve(async ({ request, status }) => {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session) return status(401, "Non authentifié");
		return { user: session.user };
	})
	.get(
		"/:workspaceId",
		({ params }) => WorkspaceService.getWorkspacesMembers(params.workspaceId),
		{
			params: t.Object({ workspaceId: t.String() }),
			response: { 200: t.Array(WorkspaceMembersModel.createResponse) },
		},
	)
	.post(
		"/:workspaceId",
		({ params, body }) =>
			WorkspaceService.createWorkspaceMember(params.workspaceId, body),
		{
			params: t.Object({ workspaceId: t.String() }),
			body: WorkspaceMembersModel.createBody,
			response: { 200: WorkspaceMembersModel.createResponse },
		},
	);
