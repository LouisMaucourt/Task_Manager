import Elysia, { t } from "elysia";
import { BoardModel } from "./model";
import * as BoardsService from "./service";

export const boards = new Elysia({ prefix: "/boards" })
	.get(
		"/:projectId",
		({ params }) => BoardsService.getBoards(params.projectId),
		{
			params: BoardModel.projectParams,
			response: t.Array(BoardModel.board),
		},
	)
	.post("/", ({ body }) => BoardsService.createBoard(body), {
		body: BoardModel.createBody,
		response: BoardModel.board,
	})
	.patch(
		"/:id",
		async ({ params, body, status }) => {
			const board = await BoardsService.updateBoard(params.id, body);
			return board ?? status(404, "Board not found");
		},
		{
			params: BoardModel.idParams,
			body: BoardModel.updateBody,
			response: { 200: BoardModel.board, 404: t.String() },
		},
	)
	.delete(
		"/:id",
		async ({ params, status }) => {
			const board = await BoardsService.deleteBoard(params.id);
			return board ?? status(404, "Board not found");
		},
		{
			params: BoardModel.idParams,
			response: { 200: BoardModel.board, 404: t.String() },
		},
	);
