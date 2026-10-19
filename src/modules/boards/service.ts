import { pool } from "../../../backend/client";
import type { Board, CreateBoardBody, UpdateBoardBody } from "./model";

const COLUMNS = `id, name, position, project_id AS "projectId"`;

export async function getBoards(projectId: string): Promise<Board[]> {
	const result = await pool.query(
		`SELECT ${COLUMNS}
		 FROM boards
		 WHERE project_id = $1
		 ORDER BY position ASC`,
		[projectId],
	);
	return result.rows;
}

export async function createBoard(data: CreateBoardBody): Promise<Board> {
	const result = await pool.query(
		`INSERT INTO boards (name, project_id, position)
		 VALUES (
			$1,
			$2,
			(SELECT COALESCE(MAX(position), -1) + 1 FROM boards WHERE project_id = $2)
		 )
		 RETURNING ${COLUMNS}`,
		[data.name, data.projectId],
	);
	return result.rows[0];
}

export async function updateBoard(
	id: string,
	body: UpdateBoardBody,
): Promise<Board | null> {
	const result = await pool.query(
		`UPDATE boards
		 SET name = COALESCE($2, name),
		     position = COALESCE($3, position),
		     updated_at = now()
		 WHERE id = $1
		 RETURNING ${COLUMNS}`,
		[id, body.name ?? null, body.position ?? null],
	);
	return result.rows[0] ?? null;
}

export async function deleteBoard(id: string): Promise<Board | null> {
	const result = await pool.query(
		`DELETE FROM boards
		 WHERE id = $1
		 RETURNING ${COLUMNS}`,
		[id],
	);
	return result.rows[0] ?? null;
}
