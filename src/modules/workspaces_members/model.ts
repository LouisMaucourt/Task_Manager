import { t, type UnwrapSchema } from "elysia";

export const WorkspaceMembersModel = {
	params: t.Object({
		workspaceId: t.String(),
	}),
	createBody: t.Object({
		email: t.String({ format: "email" }),
		role: t.UnionEnum(["owner", "admin", "member", "viewer"]),
	}),
	createResponse: t.Object({
		id: t.String(),
		workspace_id: t.String(),
		user_id: t.String(),
		role: t.String(),
	}),
	updateBody: t.Partial(
		t.Object({
			workspaceId: t.String(),
			userId: t.String(),
			role: t.String(),
		}),
	),
};

export type WorkspaceMembers = UnwrapSchema<
	typeof WorkspaceMembersModel.createResponse
>;
export type CreateWorkspaceBody = UnwrapSchema<
	typeof WorkspaceMembersModel.createBody
>;
export type UpdateWorkspaceBody = UnwrapSchema<
	typeof WorkspaceMembersModel.updateBody
>;
