import { Elysia, t } from "elysia";
import { BoardListModel } from "./model";
import * as BoardListService from "./service";

export const boardsList = new Elysia({ prefix: "/boardslist" })
	.get(
		"/:boardsId",
		({ params }) => BoardListService.getBoardsList(params.boardsId),
		{
			params: BoardListModel.boardsParams,
			response: t.Array(BoardListModel.boardList),
		},
	)
	.post("/", ({ body }) => BoardListService.createBoardList(body), {
		body: BoardListModel.createBody,
		response: BoardListModel.boardList,
	});
