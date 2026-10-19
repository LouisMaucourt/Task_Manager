import { t, type UnwrapSchema } from "elysia";

export const ProjectModel = {
	params: t.Object({
		id: t.String(),
	}),
	createBody: t.Object({
		name: t.String(),
		description: t.String(),
		key: t.String(),
	}),
	updateBody: t.Partial(
		t.Object({
			name: t.String(),
			description: t.String(),
			key: t.String(),
		}),
	),
	createResponse: t.Object({
		id: t.String(),
		name: t.String(),
		description: t.String(),
		key: t.String(),
		workspaceId: t.String(),
	}),
};

export type Project = UnwrapSchema<typeof ProjectModel.createResponse>;
export type CreateProjectBody = UnwrapSchema<typeof ProjectModel.createBody>;
export type updateProjectBody = UnwrapSchema<typeof ProjectModel.updateBody>;
