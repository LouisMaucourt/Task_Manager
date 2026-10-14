import { t, type UnwrapSchema } from "elysia";

export const WorkspaceModel = {
	params: t.Object({
		id: t.String(),
	}),
	createBody: t.Object({
		name: t.String(),
		description: t.String(),
	}),
	updateBody: t.Partial(
		t.Object({
			name: t.String(),
			description: t.String(),
		}),
	),
	createResponse: t.Object({
		id: t.String(),
		name: t.String(),
		description: t.String(),
	}),
};

export type Workspace = UnwrapSchema<typeof WorkspaceModel.createResponse>;
export type CreateWorkspaceBody = UnwrapSchema<
	typeof WorkspaceModel.createBody
>;
export type UpdateWorkspaceBody = UnwrapSchema<
	typeof WorkspaceModel.updateBody
>;
