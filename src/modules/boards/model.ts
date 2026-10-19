import { t, type UnwrapSchema } from "elysia";

export const BoardModel = {
	projectParams: t.Object({
		projectId: t.String(),
	}),
	idParams: t.Object({
		id: t.String(),
	}),
	createBody: t.Object({
		name: t.String(),
		projectId: t.String(),
	}),
	updateBody: t.Partial(
		t.Object({
			name: t.String(),
			position: t.Number(),
		}),
	),
	board: t.Object({
		id: t.String(),
		name: t.String(),
		position: t.Number(),
		projectId: t.String(),
	}),
};

export type Board = UnwrapSchema<typeof BoardModel.board>;
export type CreateBoardBody = UnwrapSchema<typeof BoardModel.createBody>;
export type UpdateBoardBody = UnwrapSchema<typeof BoardModel.updateBody>;
