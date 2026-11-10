import { Elysia, t } from "elysia";
import { auth } from "../../lib/auth";
import { WorkspaceInvitationModel } from "./model";
import * as WorkspaceService from "./service";

export const workspacesInvitation = new Elysia({
	prefix: "/workspaceinvitation",
})
	.get(
		"/token/:token",
		async ({ params, status }) => {
			const inv = await WorkspaceService.getWorkspacesInvitationToken(
				params.token,
			);
			if (!inv) return status(404, "Invitation invalide ou expirée");
			return inv;
		},
		{
			params: WorkspaceInvitationModel.previewParams,
			response: {
				200: WorkspaceInvitationModel.previewResponse,
				404: t.String(),
			},
		},
	)
	.resolve(async ({ request, status }) => {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session) return status(401, "Non authentifié");
		return { user: session.user };
	})
	.get(
		"/:workspaceId",
		({ params }) =>
			WorkspaceService.getWorkspacesInvitation(params.workspaceId),
		{
			params: t.Object({ workspaceId: t.String() }),
			response: { 200: t.Array(WorkspaceInvitationModel.createResponse) },
		},
	)
	.post(
		"/:workspaceId",
		({ params, body, user }) =>
			WorkspaceService.createWorkspaceInvitation(
				params.workspaceId,
				body,
				user.id,
			),
		{
			params: WorkspaceInvitationModel.params,
			body: WorkspaceInvitationModel.createBody,
			response: { 200: WorkspaceInvitationModel.createResponse },
		},
	)
	.post(
		"/token/:token/accept",
		async ({ params, user, status }) => {
			const res = await WorkspaceService.acceptInvitation(params.token, user);
			if (!res)
				return status(
					400,
					"Invitation invalide, expirée ou pour un autre email",
				);
			return res;
		},
		{ params: WorkspaceInvitationModel.previewParams },
	);
