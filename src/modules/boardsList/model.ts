import { t, type UnwrapSchema } from "elysia";

export const BoardListModel = {
	boardsParams: t.Object({
		boardsId: t.String(),
	}),
	idParams: t.Object({
		id: t.String(),
	}),
	createBody: t.Object({
		name: t.String(),
		boardsId: t.String(),
	}),
	updateBody: t.Partial(
		t.Object({
			name: t.String(),
			position: t.Number(),
		}),
	),
	boardList: t.Object({
		id: t.String(),
		name: t.String(),
		position: t.Number(),
		status: t.String(),
		boardsId: t.String(),
	}),
};

export type BoardList = UnwrapSchema<typeof BoardListModel.boardList>;
export type CreateBoardListBody = UnwrapSchema<
	typeof BoardListModel.createBody
>;
export type UpdateBoardListBody = UnwrapSchema<
	typeof BoardListModel.updateBody
>;
