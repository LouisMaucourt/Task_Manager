import { pool } from "../../../backend/client";
import type { BoardList, CreateBoardListBody } from "./model";

const COLUMNS = `id, name, position, status, board_id AS "boardsId"`;

export async function getBoardsList(boardId: string): Promise<BoardList[]> {
	const result = await pool.query(
		`SELECT ${COLUMNS}
		 FROM board_lists
		 WHERE board_id = $1
		 ORDER BY position ASC`,
		[boardId],
	);
	return result.rows;
}

export async function createBoardList(
	data: CreateBoardListBody,
): Promise<BoardList> {
	const result = await pool.query(
		`INSERT INTO board_lists (name, board_id, position)
		 VALUES (
			$1,
			$2,
			(SELECT COALESCE(MAX(position), 0) + 1 FROM board_lists WHERE board_id = $2)
		 )
		 RETURNING ${COLUMNS}`,
		[data.name, data.boardsId],
	);
	return result.rows[0];
}
