import { t, type UnwrapSchema } from "elysia";

export const WorkspaceInvitationModel = {
	params: t.Object({
		workspaceId: t.String({ format: "uuid" }),
	}),
	previewParams: t.Object({
		token: t.String(),
	}),

	previewResponse: t.Object({
		email: t.String(),
		role: t.UnionEnum(["admin", "member", "viewer"]),
		workspace_name: t.String(),
	}),

	createBody: t.Object({
		email: t.String({ format: "email" }),
		role: t.Optional(t.UnionEnum(["admin", "member", "viewer"])),
	}),

	createResponse: t.Object({
		id: t.String(),
		workspace_id: t.String(),
		email: t.String(),
		role: t.String(),
		token: t.String(),
		expires_at: t.String(),
	}),

	updateBody: t.Object({
		role: t.Optional(t.UnionEnum(["admin", "member", "viewer"])),
	}),
};

export type WorkspaceInvitation = UnwrapSchema<
	typeof WorkspaceInvitationModel.createResponse
>;

export type InvitationPreview = UnwrapSchema<
	typeof WorkspaceInvitationModel.previewResponse
>;

export type CreateWorkspaceInvitationBody = UnwrapSchema<
	typeof WorkspaceInvitationModel.createBody
>;

export type UpdateWorkspaceInvitationBody = UnwrapSchema<
	typeof WorkspaceInvitationModel.updateBody
>;
