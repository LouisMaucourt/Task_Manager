import { pool } from "../../../backend/client";
import type { CreateTaskBody, Task, UpdateTaskBody } from "./model";

const COLUMNS = `t.id, t.title, COALESCE(t.description, '') AS description, t.position, t.priority, t.list_id AS "listId"`;
const RETURNING = `id, title, COALESCE(description, '') AS description, position, priority, list_id AS "listId"`;

export async function getTasksByBoard(boardId: string): Promise<Task[]> {
	const result = await pool.query(
		`SELECT ${COLUMNS}
		 FROM tasks t
		 JOIN board_lists bl ON bl.id = t.list_id
		 WHERE bl.board_id = $1
		 ORDER BY t.position ASC`,
		[boardId],
	);
	return result.rows;
}

export async function createTask(
	data: CreateTaskBody,
	userId: string,
): Promise<Task> {
	const result = await pool.query(
		`INSERT INTO tasks (project_id, list_id, number, title, position, created_by)
		 SELECT
			b.project_id,
			bl.id,
			(SELECT COALESCE(MAX(number), 0) + 1 FROM tasks WHERE project_id = b.project_id),
			$2,
			(SELECT COALESCE(MAX(position), 0) + 1 FROM tasks WHERE list_id = bl.id),
			$3
		 FROM board_lists bl
		 JOIN boards b ON b.id = bl.board_id
		 WHERE bl.id = $1
		 RETURNING ${RETURNING}`,
		[data.listId, data.title, userId],
	);
	if (!result.rows[0]) throw new Error("List not found");
	return result.rows[0];
}

export async function updateTask(
	id: string,
	body: UpdateTaskBody,
): Promise<Task | null> {
	const res = await pool.query(
		`UPDATE tasks
		 SET title = COALESCE($2::varchar, title),
			 description = COALESCE($3::text, description),
			 priority = COALESCE($4::task_priority, priority),
			 position = CASE
				WHEN $5::double precision IS NOT NULL THEN $5::double precision
				WHEN $6::uuid IS NOT NULL AND $6::uuid <> list_id THEN
					(SELECT COALESCE(MAX(position), 0) + 1 FROM tasks WHERE list_id = $6::uuid)
				ELSE position
			 END,
			 list_id = COALESCE($6::uuid, list_id),
			 updated_at = now()
		 WHERE id = $1
		   AND (
				$6::uuid IS NULL
				OR EXISTS (
					SELECT 1
					FROM board_lists bl
					JOIN boards b ON b.id = bl.board_id
					WHERE bl.id = $6::uuid AND b.project_id = tasks.project_id
				)
		   )
		 RETURNING ${RETURNING}`,
		[
			id,
			body.title ?? null,
			body.description ?? null,
			body.priority ?? null,
			body.position ?? null,
			body.listId ?? null,
		],
	);
	return res.rows[0] ?? null;
}

export async function deleteTask(id: string): Promise<Task | null> {
	const res = await pool.query(
		`DELETE FROM tasks WHERE id = $1 RETURNING ${RETURNING}`,
		[id],
	);
	return res.rows[0] ?? null;
}
